# Audit du code – My-Workout (frontend Angular)

Audit en lecture seule du dossier `my-workout-app` (le backend `my-workout-api` est hors scope). Objectif : lister les points à corriger/améliorer avant la refonte du design et avant une future montée de version Angular. La compatibilité Angular 22 / PrimeNG n'est volontairement pas traitée ici.

Sévérités utilisées : **Critique** (bug ou risque impactant directement l'utilisateur ou la sécurité), **Important** (à corriger avant la suite du projet), **Mineur** (amélioration de confort/qualité).

## Sommaire

1. [Sécurité](#1-sécurité)
2. [Qualité / clarté du code](#2-qualité--clarté-du-code)
3. [Algorithmes / logique](#3-algorithmes--logique)
4. [Architecture générale](#4-architecture-générale)
5. [Synthèse rapide](#5-synthèse-rapide)

---

## 1. Sécurité

### Critique

**S1. Jetons d'authentification stockés en `localStorage`**
- Fichiers : `src/app/auth/auth.service.ts` (lignes 26-27, 42, 49-50, 70-71), `src/app/auth/auth.interceptor.ts` (ligne 12).
- Problème : `access-token` et `refresh-token` sont stockés dans `localStorage` et le `refresh-token` (longue durée de vie) y est lu/écrit directement. `localStorage` est accessible par n'importe quel script JS exécuté dans la page.
- Pourquoi c'est un problème : en cas de faille XSS (même mineure, via une dépendance tierce par exemple), un attaquant peut lire `localStorage` et voler les deux jetons, y compris le refresh token, ce qui permet une prise de contrôle de session durable. Il n'y a aucune protection XSS native de type cookie `httpOnly`.
- Suggestion : migrer vers un cookie `httpOnly` + `Secure` + `SameSite=Strict/Lax` géré par le backend pour le refresh token (et idéalement aussi pour l'access token), avec `withCredentials: true` côté Angular. Si un changement backend n'est pas possible à court terme, au minimum isoler le refresh token (ne jamais l'exposer en dehors du service) et renforcer la CSP pour réduire la surface XSS.

### Important

**S2. Dépendance `pg` (driver PostgreSQL) présente dans le `package.json` du frontend**
- Fichier : `package.json` ligne 35 (`"pg": "^8.14.1"`).
- Constat : recherche effectuée dans tout `src/` — aucun import de `pg` nulle part dans le code applicatif Angular.
- Pourquoi c'est un problème : un driver de base de données n'a strictement rien à faire dans un bundle frontend. C'est très probablement un résidu de copier-coller depuis le `package.json` du backend (`my-workout-api`), ou une dépendance ajoutée par erreur. Au mieux c'est du poids mort (taille de `node_modules`, surface de `npm audit` à surveiller inutilement), au pire cela peut semer la confusion sur l'architecture du projet pour quiconque l'inspecte (y compris un auditeur de sécurité externe qui pourrait se demander si des identifiants de base de données fuient côté client).
- Suggestion : supprimer cette dépendance du `package.json` frontend (`npm uninstall pg`) après confirmation qu'elle n'est utilisée par aucun script de build/outillage.

**S3. Configuration d'outillage (ESLint) non fonctionnelle**
- Fichiers : `.eslintrc.json` (racine), `package.json`.
- Constat : un fichier `.eslintrc.json` complet existe (règles `@angular-eslint/*`), mais aucun package `eslint` / `@angular-eslint/*` n'est déclaré dans `dependencies` ou `devDependencies` du `package.json`, et il n'y a pas de script `lint`. Le lint ne peut donc pas s'exécuter tel que configuré.
- Pourquoi c'est un problème : une règle de nommage est définie (`@angular-eslint/component-selector` exige le préfixe `app`) mais n'est jamais appliquée en pratique — ce qui explique probablement l'incohérence relevée en Q6 (sélecteur `select-muscle-group-workout` sans préfixe `app-`). Un gate qualité "fantôme" donne une fausse impression de sécurité.
- Suggestion : soit réinstaller l'outillage ESLint manquant et ajouter un script `"lint": "ng lint"` / l'intégrer en CI, soit supprimer la configuration si elle n'est plus utilisée, pour éviter la confusion.

### À qualifier (pas un vrai risque)

**S4. Clé publique EmailJS en dur dans `src/environments/*.ts`**
- Fichiers : `src/environments/environment.ts` et `environment.prod.ts` (bloc `EMAIL_JS`).
- Constat : `PUBLIC_KEY`, `SERVICE_ID`, `TEMPLATE_ID` EmailJS sont codés en dur, identiques en dev et en prod.
- Analyse : ce n'est **pas** un vrai risque de sécurité au sens classique — EmailJS est conçu pour que sa "Public Key" soit exposée côté client (c'est son modèle d'intégration officiel), contrairement à une clé privée d'API. Le risque réel est plutôt l'abus (spam/flood) du endpoint EmailJS si la clé est utilisée sans restriction.
- Suggestion (amélioration, pas correction critique) : dans le dashboard EmailJS, activer la restriction de domaine ("Allowed origins") pour que la clé ne fonctionne que depuis `my-workout.alexandre-vernet.fr`, et envisager un rate-limiting/captcha sur le formulaire "mot de passe oublié" pour limiter les abus (cf. aussi bug fonctionnel S5 ci-dessous qui aggrave ce risque).

### Important (complément fonctionnel lié à la sécurité)

**S5. Pas de gestion d'erreur sur l'appel "mot de passe oublié", bouton bloqué**
- Fichier : `src/app/auth/forgot-password/forgot-password.component.ts` (méthode `forgotPassword`, lignes 34-71).
- Problème : `this.passwordResetTokenService.forgotPassword(email).subscribe({ next: ... })` ne définit **aucun callback `error`**. Si l'appel échoue (email inconnu, 500, etc.), rien ne se passe pour l'utilisateur : `isLoading` reste `true` indéfiniment (bouton bloqué) et aucune alerte d'erreur n'est affichée.
- Suggestion : ajouter un callback `error` qui remet `isLoading = false` et affiche une alerte (comme fait systématiquement ailleurs dans le code, ex. `list-exercises.component.ts`).

**S6. Guards basés sur un appel réseau à chaque navigation**
- Fichiers : `src/app/auth/auth.guard.ts`, `src/app/auth/default-home-page.guard.ts`.
- Problème : `authGuard` et `defaultHomePageGuard` appellent `authService.getCurrentUser()` (requête HTTP `GET /auth/me`) à **chaque** activation de route protégée, plutôt que de vérifier d'abord la présence locale d'un token. `defaultHomePageGuard` fait de même simplement pour décider d'une redirection sur la route "catch-all" `**`.
- Pourquoi c'est un problème : ce n'est pas un trou de sécurité en soi (la validation serveur est une bonne pratique), mais c'est redondant/coûteux (un aller-retour réseau à chaque clic de menu) et fragile en cas de latence/coupure réseau (l'utilisateur peut être éjecté vers `/auth/login` alors qu'il est bien connecté). Les guards ne retournent pas non plus de `UrlTree` (pattern Angular recommandé) mais appellent `router.navigate()` en plus de retourner `false`/`true`, ce qui est redondant avec le mécanisme standard de guard.
- Suggestion : vérifier d'abord la présence d'un token local avant d'appeler l'API, mettre en cache le résultat de `getCurrentUser()` le temps de la session (ex. signal/`shareReplay`), et retourner un `UrlTree` via `router.createUrlTree(...)` plutôt que d'appeler `navigate()` manuellement dans le guard.

---

## 2. Qualité / clarté du code

### Important

**Q1. `strict: false` dans `tsconfig.json`**
- Fichier : `tsconfig.json` ligne 9.
- Problème : le mode strict TypeScript (`strictNullChecks`, `noImplicitAny`, etc.) est désactivé. C'est une racine commune à plusieurs bugs relevés dans ce rapport (ex. accès `err.error.message` sans vérification qui compile sans erreur alors qu'il devrait être signalé, `delete user.password` sur une propriété non optionnelle de `User`, cf. Q2).
- Pourquoi c'est un problème : objectif affiché étant d'avoir "une base de code très propre", le mode non strict laisse passer silencieusement des erreurs de null-safety qui sont pourtant la cause de plusieurs bugs listés plus bas.
- Suggestion : activer `strict: true` progressivement (ou au moins `strictNullChecks` et `noImplicitAny` dans un premier temps), fichier par fichier si besoin via des `// @ts-expect-error` temporaires, avant la refonte visuelle.

**Q2. Modélisation `User` incohérente avec son usage réel**
- Fichiers : `src/interfaces/User.ts`, `src/app/navbar/view-profile/manage-account/manage-account.component.ts` (lignes 58-67), `src/app/auth/auth.service.ts` (méthode `updateUser`).
- Problème : `User.password` est typé comme obligatoire (`password: string`), alors que `getCurrentUser()` ne renvoie jamais de mot de passe et que `manage-account.component.ts` fait littéralement `delete user.password` / `delete user.email` de façon conditionnelle. Le typage ne reflète pas la réalité métier (un "User" renvoyé par l'API n'a pas de password en clair, et un "UpdateUserRequest" est un objet différent avec des champs tous optionnels).
- Suggestion : créer un DTO dédié `UpdateUserRequest { email?: string; password?: string; confirmPassword?: string }` séparé de l'interface `User` (vue "lecture"), pour éviter les `delete` sur des champs supposés requis.

**Q3. Gestion d'erreur HTTP incohérente et fragile (`err.error.xxx` sans garde)**
- Fichiers concernés (liste non exhaustive) :
  - `src/app/navbar/workout/workout-session/exercises-table/exercises-table.component.ts` lignes 85, 103, 123 : `err.error.message` sans `?.`
  - `src/app/auth/register/register.component.ts` lignes 50-71 : accès direct à `err.error.type`, `err.error.errors`, `err.error.errorCode` sans vérifier que `err.error` existe.
  - `src/app/navbar/view-profile/manage-account/manage-account.component.ts` lignes 79-95 : même pattern.
  - `src/app/navbar/view-profile/admin/add-exercise/add-exercise.component.ts` lignes 117, 121 (`generateExerciseDescription`) : `err.error.errorCode` sans `?.` (alors que la méthode `createExercise` juste en dessous, lignes 161-169, utilise `err?.error?.errorCode` — incohérence dans le même fichier).
- Pourquoi c'est un problème : en cas d'erreur réseau pure (timeout, serveur injoignable, CORS), `err.error` peut être `null`/`undefined` — le code plantera alors dans le *handler d'erreur lui-même*, masquant l'erreur originale et cassant l'UI (le formulaire ne recevra jamais son message d'erreur). C'est aussi une duplication quasi identique de logique de mapping d'erreurs répétée dans `register.component.ts` et `manage-account.component.ts`.
- Suggestion : systématiser l'accès optionnel (`err?.error?.xxx`) partout, et idéalement extraire un petit helper partagé (ex. `shared/utils/http-error.ts`) pour mapper un `CustomError` → message/erreurs de formulaire, afin d'éliminer la duplication entre `register` et `manage-account`.

**Q4. `AlertComponent` : fuite de souscription + condition de course sur le timer d'auto-fermeture**
- Fichier : `src/app/shared/alert/alert.component.ts` (lignes 21-31).
- Problème : `alertService.alert$.subscribe(...)` n'est jamais désabonné (`takeUntilDestroyed` absent), et chaque nouvelle alerte programme un `setTimeout(4000ms)` indépendant qui remet `this.alert = null` sans annuler le timeout précédent. Si deux alertes arrivent à moins de 4s d'intervalle, le premier timeout peut effacer la seconde alerte avant ses 4 secondes.
- Pourquoi c'est un problème : bug visible utilisateur (une alerte peut disparaître trop tôt) ; le composant étant un singleton de layout (toujours monté), le risque de fuite mémoire réelle est faible ici, mais le pattern n'est pas sûr si le composant venait à être recréé.
- Suggestion : utiliser `takeUntilDestroyed(destroyRef)`, et stocker/annuler le `setTimeout` précédent (`clearTimeout`) à chaque nouvelle alerte, ou remplacer par un `switchMap` RxJS (`timer(4000)`).

**Q5. Duplication de la logique "pas d'exercice ajouté → proposer d'en ajouter" avec une route cassée**
- Fichiers : `src/app/navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component.ts` (lignes 85-104) et `src/app/navbar/workout/workout-session/workout-session.component.ts` (lignes 293-314).
- Problème : le même dialog de confirmation (texte, boutons) est dupliqué à l'identique dans deux composants, **et les deux redirigent vers une route inexistante** `['/', 'library', 'list-exercises-muscle-group', muscleGroupId]` — voir le détail du bug dans la section Algorithmes (A1).
- Suggestion : extraire ce dialog dans un petit service/composant partagé pour éviter la double maintenance, et corriger la route dans la foulée.

### Mineur

**Q6. Incohérence de nommage : sélecteur de composant sans préfixe `app-`**
- Fichier : `src/app/navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component.ts` ligne 23 : `selector: 'select-muscle-group-workout'`.
- Tous les autres composants du projet utilisent le préfixe `app-` (`app-calendar`, `app-stats`, etc.), et la règle ESLint configurée (cf. S3) l'impose explicitement. Seul ce composant déroge à la règle.
- Suggestion : renommer en `app-select-muscle-group-workout` (impact : mise à jour du template parent qui l'utilise).

**Q7. Mélange `@Input()`/`@Output()` (decorators) et `input()`/`output()` (signals) sans convention claire**
- Exemples : `input()` utilisé dans `view-exercise.component.ts`, `workout-session.component.ts`, `graphs.component.ts`, `add-exercise.component.ts`, `reset-password.component.ts` ; alors que `@Input()`/`@Output() x = new Subject<T>()` est utilisé dans `exercises-table.component.ts`, `dialog-select-cardio-exercise.component.ts`, `forgot-password.component.ts`, `account-actions.component.ts`, `manage-account.component.ts`, `history-detail.component.ts`.
- Problème : les deux styles coexistent sans règle apparente, et les `@Output()` sont systématiquement typés comme `Subject<T>` brut plutôt que `EventEmitter<T>` (classique) ou la fonction `output<T>()` (recommandée en Angular 17+, cohérente avec les signaux déjà utilisés ailleurs dans le projet).
- Pourquoi c'est un problème : un `Subject` exposé en `@Output()` fonctionne (il implémente la même API `.emit()`-like via `.next()`), mais ce n'est pas le pattern idiomatique Angular ; un lecteur du code doit se demander pourquoi certains événements sont des `Subject` et d'autres des `EventEmitter`/signaux.
- Suggestion : avant la refonte, profiter du passage en revue du design pour harmoniser systématiquement sur `input()`/`output()` (signals), cohérent avec Angular 21.

**Q8. Pipe `plurial` — faute d'orthographe dans le nom**
- Fichier : `src/app/shared/pipes/plurial.pipe.ts`.
- Le pipe s'appelle `plurial` (devrait être `pluriel` en français, ou `plural` en anglais). Mineur mais visible dans tous les templates qui l'utilisent (`{{ liste | plurial }}`).
- Suggestion : renommer en `pluriel` (ou `plural` si l'équipe préfère l'anglais pour les symboles de code), avec impact sur tous les templates qui l'utilisent.

**Q9. Accessibilité basique manquante sur le formulaire de connexion**
- Fichier : `src/app/auth/login/login.component.html` (lignes 8, 25).
- Les champs email/mot de passe n'ont ni `<label>` ni `aria-label`, uniquement un `placeholder` et une icône décorative — pour un lecteur d'écran, le champ n'a pas de nom accessible clair. De même, le lien "Mot de passe oublié" (ligne 36) est un `<span (click)="...">` plutôt qu'un élément interactif natif (`<button>`/`<a>`), donc non focusable au clavier par défaut (pas de `tabindex`, pas de gestion `keydown.enter`).
- Suggestion : ajouter des `aria-label` sur les inputs (`aria-label="Email"` / `aria-label="Mot de passe"`) a minima, et remplacer le `<span (click)>` par un `<button type="button">` stylé en lien.

**Q10. `console.error` resté dans `main.ts`**
- Fichier : `src/main.ts` ligne 9 : `bootstrapApplication(...).catch((err) => console.error(err))`.
- C'est le seul `console.*` du projet (bonne nouvelle, la base est globalement propre sur ce point) — mais pour un bootstrap qui échoue en production, un simple `console.error` ne remonte l'information à personne (pas de monitoring).
- Suggestion : à minima documenter que c'est acceptable pour un échec de bootstrap (cas rarissime), ou brancher un outil de monitoring d'erreurs front (Sentry, etc.) si ce n'est pas déjà fait côté infra.

---

## 3. Algorithmes / logique

### Critique

**A1. Routes de navigation cassées dans deux dialogues "aucun exercice ajouté"**
- Fichiers : `src/app/navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component.ts` ligne 101, `src/app/navbar/workout/workout-session/workout-session.component.ts` ligne 310.
- Problème : les deux appellent `this.router.navigate(['/', 'library', 'list-exercises-muscle-group', muscleGroupId])`. Or `src/app/app.routes.ts` ne définit, sous `library`, que les chemins `''` (liste) et `exercise/:exerciseId`, avec un `**` qui redirige vers `''`. La route `list-exercises-muscle-group/:id` **n'existe pas**.
- Pourquoi c'est un problème : c'est un parcours utilisateur central ("je veux démarrer une séance mais je n'ai pas encore d'exercices ajoutés → j'accepte d'aller en ajouter") qui redirige silencieusement vers la liste générale de la bibliothèque, en perdant le filtre par groupe musculaire prévu. L'utilisateur ne comprend pas pourquoi il atterrit sur une liste non filtrée.
- Suggestion : soit créer réellement la route filtrée par groupe musculaire (`library?muscleGroup=...` ou route dédiée), soit, si elle n'a jamais existé, remplacer par une navigation vers `['/', 'library']` avec un paramètre de requête que `ListExercisesComponent` sait déjà interpréter via `filterExercise(muscleGroupEnum)`.

### Important

**A2. Conversion de date non robuste au fuseau horaire (`DateUtils.toLocalDate`)**
- Fichiers : `src/app/shared/utils/date-utils.ts`, utilisé par `src/app/services/workout.service.ts` (méthode `findByDate`, lignes 33-40) pour construire la plage de dates envoyée à l'API calendrier.
- Problème : `date.toISOString().slice(0, 10)` convertit la date en **UTC** avant de ne garder que la partie "jour". Pour un utilisateur en France (UTC+1 en hiver, UTC+2 en été), une date locale comme le 1er du mois à 00h00 peut devenir le 30/31 du mois précédent en UTC, décalant la requête d'un jour.
- Pourquoi c'est un problème : ceci affecte directement l'affichage du calendrier d'entraînements (`CalendarComponent`), qui appelle `findByDate(start, end)` à chaque changement de mois — un entraînement peut apparaître/disparaître du mois affiché selon l'heure et la saison, un bug silencieux et difficile à détecter en test manuel (dépend de l'heure locale au moment du test).
- Suggestion : construire la chaîne `YYYY-MM-DD` à partir des composants **locaux** de la date (`date.getFullYear()`, `getMonth()`, `getDate()`) plutôt que de passer par `toISOString()`.

**A3. `GraphsComponent` : instance Chart.js non détruite, sélection par `id` global fragile**
- Fichier : `src/app/navbar/stats/graphs/graphs.component.ts` (lignes 29-55).
- Problème : `document.getElementById('bar')` cible un id DOM global plutôt qu'un `@ViewChild` local, et `new Chart(...)` crée une nouvelle instance à chaque `ngOnInit` sans jamais appeler `chart.destroy()` au préalable ou dans `ngOnDestroy`.
- Pourquoi c'est un problème : si l'utilisateur navigue plusieurs fois vers des graphiques d'exercices différents, chaque nouvelle instance Chart.js s'accroche au même `<canvas id="bar">` sans libérer la précédente, ce qui fuit de la mémoire et peut provoquer un rendu incorrect/superposé (comportement documenté comme piège classique de Chart.js avec Angular).
- Suggestion : utiliser `@ViewChild('bar') canvasRef` et détruire l'instance existante (`this.chart?.destroy()`) avant d'en créer une nouvelle, ou implémenter `ngOnDestroy`.

**A4. `ExercisesTableComponent.ngOnChanges` : accès non sécurisé à `changes['exerciseId']`**
- Fichier : `src/app/navbar/workout/workout-session/exercises-table/exercises-table.component.ts` (lignes 52-56).
- Problème : `if (changes['exerciseId'].currentValue !== changes['exerciseId'].previousValue)`. Angular ne place dans l'objet `SimpleChanges` que les clés des `@Input()` qui ont effectivement changé lors du cycle courant. Si seul `muscleGroupId` change (et pas `exerciseId`) pendant un cycle de détection de changement, `changes['exerciseId']` est `undefined`, et `.currentValue` lève une `TypeError` à l'exécution.
- Pourquoi c'est un problème : ce composant est utilisé dans `workout-session.component.ts` où `muscleGroupId` et `exerciseId` ne changent pas forcément ensemble (changement d'onglet d'exercice sans changer de groupe musculaire est le cas courant, mais l'inverse — ou un changement partiel — reste possible selon le binding parent) ; le risque existe bel et bien dans ce pattern.
- Suggestion : garder `if (changes['exerciseId'] && changes['exerciseId'].currentValue !== changes['exerciseId'].previousValue)`.

**A5. Parsing fragile du timer de repos par découpage de chaîne**
- Fichier : `src/app/navbar/workout/workout-session/workout-session.component.ts` (méthode `stopTimer`, lignes 280-290), format produit par `src/app/services/rest-time.service.ts` (`formatTimer`, lignes 64-70).
- Problème : `WorkoutSessionComponent` reconstruit un temps de repos en faisant `this.restTime.split(':')[0]`, `[1]`, `[2]` sur la chaîne `MM:SS:CS` produite par le service. Le couplage entre le format texte (`RestTimeService`) et son parsing (`WorkoutSessionComponent`) n'est maintenu par aucun type — toute évolution du format de `formatTimer` (ex. ajouter les heures) casse silencieusement `stopTimer()`.
- Suggestion : faire émettre à `RestTimeService` un objet structuré (`{ minutes, seconds, centiseconds }`) plutôt qu'une chaîne déjà formatée, et ne formater qu'au niveau de l'affichage (pipe dédié si besoin).

**A6. `showDialogAddExerciseToWorkout` utilise la variable globale implicite `event`**
- Fichier : `src/app/navbar/view-profile/admin/add-exercise/add-exercise.component.ts` (ligne 185) : `target: event.target as EventTarget`.
- Problème : `event` n'est ni un paramètre de la méthode, ni une variable locale déclarée — c'est l'objet global déprécié `window.event`. Dans un flux Angular (callback suite à un appel HTTP asynchrone, cf. `createExercise()` qui appelle cette méthode dans un callback `next`), il n'y a généralement **aucun événement DOM "courant"** au moment de l'exécution : `window.event` sera `undefined`, et `target: undefined.target` lèvera une erreur, ou au mieux positionnera mal le `ConfirmDialog` (cible de positionnement absente).
- Suggestion : passer explicitement l'événement de clic du bouton déclencheur (`($event)` depuis le template jusqu'à `createExercise(event: Event)`), ou retirer la clé `target` si le positionnement relatif n'est pas strictement nécessaire pour ce `ConfirmDialog`.

### Mineur

**A7. `ThemeService.toggleDarkMode` : état DOM togglé indépendamment de l'état stocké demandé**
- Fichier : `src/app/shared/theme/theme.service.ts` (lignes 41-49).
- Problème : la méthode fait toujours `element.classList.toggle('dark-mode')` (bascule sans condition) puis écrit en `localStorage` la valeur du paramètre `isCheckedDarkMode` reçu. Si cette méthode était appelée deux fois avec le même paramètre (ex. clic rapide/double événement), la classe CSS et la valeur stockée en `localStorage` divergeraient (la classe se re-togglerait, mais le localStorage resterait identique).
- Suggestion : utiliser `classList.toggle('dark-mode', isCheckedDarkMode)` (forme à 2 arguments, qui force l'état plutôt que de l'inverser) pour que DOM et stockage restent toujours synchronisés.

**A8. `convertWeightElastic` : recherche combinatoire par backtracking sans mémoïsation**
- Fichier : `src/app/shared/utils/convert-weight-elastic.ts`.
- Constat : l'algorithme de recherche de la meilleure combinaison d'élastiques est un backtracking classique, correct pour le jeu de données actuel (5 élastiques, poids multiples de 5). Ce n'est pas un bug, mais la fonction recalcule tout à chaque appel (pas de cache) et est appelée à chaque frappe dans le champ poids via `convertWeightToElastics()` (`workout-session.component.ts` ligne 184). Avec le jeu de données actuel (5 types, quantités limitées), l'impact est négligeable, mais le code mérite un commentaire explicite sur cette limite si la liste d'élastiques venait à grandir.
- Suggestion : aucune action urgente ; à surveiller si la table `elastics` s'agrandit significativement.

---

## 4. Architecture générale

### Important

**AR1. Absence totale de tests automatisés**
- Constat : aucun fichier `*.spec.ts` n'existe dans `src/`, `package.json` ne définit ni script `test` ni dépendance de test (Jasmine/Karma/Jest), bien que le projet soit généré par Angular CLI (qui fournit normalement cette infrastructure par défaut).
- Pourquoi c'est un problème : avant une refonte de design et une montée de version, l'absence totale de filet de sécurité (tests unitaires sur les services métier comme `convertWeightElastic`, `DateUtils`, `AuthService`, ou tests de composants sur la logique de formulaire) rend tout changement risqué à valider "à la main".
- Suggestion : réintroduire une configuration de test (Jasmine/Karma ou migration vers Jest/Vitest), en commençant par les fonctions pures les plus critiques (`convert-weight-elastic.ts`, `date-utils.ts`, les pipes) puis les services HTTP avec `HttpTestingController`.

**AR2. Composants "god object" avec trop de responsabilités**
- Fichiers : `src/app/navbar/calendar/calendar.component.ts` (284 lignes), `src/app/navbar/workout/workout-session/workout-session.component.ts` (365 lignes).
- Constat : ces deux composants cumulent gestion d'état métier (workouts, filtres), appels HTTP directs, logique de swipe tactile, manipulation DOM native (`document.querySelector('.fc-prev-button')`), gestion de dialogues de confirmation, navigation, et logique de timer. Peu de délégation vers des services dédiés (ex. pas de `CalendarFilterService` ou `SwipeNavigationDirective` réutilisable).
- Pourquoi c'est un problème : ces fichiers sont difficiles à tester isolément et à faire évoluer sans régression — exactement le type de dette qu'il vaut mieux résorber avant une refonte visuelle qui va de toute façon toucher ces templates.
- Suggestion : extraire au minimum la logique de swipe tactile (dupliquée entre `calendar.component.ts` et `workout-session.component.ts`, cf. AR3) dans une directive réutilisable, et la logique de filtrage/état des entraînements dans un service dédié.

**AR3. Logique de swipe tactile dupliquée**
- Fichiers : `src/app/navbar/calendar/calendar.component.ts` (lignes 119-142), `src/app/navbar/workout/workout-session/workout-session.component.ts` (lignes 125-156).
- Constat : les deux composants réimplémentent, presque à l'identique, l'écoute `touchstart`/`touchend`, le calcul de `deltaX` et le seuil de déclenchement (50px vs 65px, seule vraie différence), avec manipulation DOM native via `ElementRef` plutôt qu'une abstraction Angular.
- Suggestion : extraire une directive standalone `appSwipe` (ou un petit service) exposant un `Output`/signal `swipeLeft`/`swipeRight`, réutilisable partout où un swipe est nécessaire (cohérent avec la présence d'une directive existante `PreventFocusOnButtonClickDirective` qui montre que le projet a déjà cette pratique pour d'autres besoins DOM).

### Mineur

**AR4. Manipulation DOM native dans `NavbarComponent` plutôt qu'API Angular**
- Fichier : `src/app/navbar/navbar.component.ts` (`ngAfterViewInit`, lignes 17-91).
- Constat : tout l'effet visuel de la navbar (bordure animée, classes actives) est piloté par `document.body.querySelector(...)` et manipulation directe de `classList`/`style`, en dehors du cycle de détection de changement Angular, sans nettoyage des `addEventListener` ajoutés (pas de `removeEventListener` dans un éventuel `ngOnDestroy` — ce composant étant un singleton de layout, l'impact réel est faible, mais le pattern n'est pas réutilisable).
- Suggestion : à l'occasion de la refonte du design (déjà prévue), réécrire cette logique avec `@ViewChild`/`Renderer2`/signals plutôt que de la reporter telle quelle dans une nouvelle version visuelle.

**AR5. Dossier `src/app/shared/theme/` avec 16 fichiers de preset quasi identiques**
- Fichiers : `src/app/shared/theme/preset-*.ts` (amber, blue, cyan, emerald, fuchsia, green, indigo, lime, orange, pink, purple, red, rose, sky, teal, violet, yellow).
- Constat : 16 fichiers séparés, chacun exportant vraisemblablement une configuration de thème PrimeNG avec la même structure et seules les valeurs de couleur changeant.
- Pourquoi c'est à noter : ce n'est pas un bug, mais avant la refonte design (qui va probablement revoir toute la gestion des couleurs/thèmes), c'est l'occasion de factoriser ces 16 fichiers en une seule fonction générative `createPreset(colorName)` plutôt que 16 fichiers quasi dupliqués à maintenir.
- Suggestion : à évaluer lors de la refonte visuelle plutôt qu'en correction isolée (dépend de l'API exacte de `@primeuix/themes`).

---

## 5. Synthèse rapide

| # | Sévérité | Catégorie | Résumé |
|---|----------|-----------|--------|
| S1 | Critique | Sécurité | Access + refresh token en `localStorage`, exposés en cas de XSS |
| A1 | Critique | Algorithmes | Route `list-exercises-muscle-group` inexistante, dupliquée dans 2 fichiers |
| S2 | Important | Sécurité | Dépendance `pg` inutile dans le `package.json` frontend |
| S3 | Important | Sécurité | Config ESLint présente mais non installée/exécutable |
| S5 | Important | Sécurité | Pas de callback d'erreur sur "mot de passe oublié" (bouton bloqué) |
| S6 | Important | Sécurité | Guards qui appellent l'API à chaque navigation, sans `UrlTree` |
| Q1 | Important | Qualité | `strict: false` dans `tsconfig.json` |
| Q2 | Important | Qualité | Interface `User` mal modélisée (password requis mais supprimé dynamiquement) |
| Q3 | Important | Qualité | Accès `err.error.x` non sécurisés, dupliqués entre composants |
| Q4 | Important | Qualité | `AlertComponent` : souscription non nettoyée + race condition sur le timer |
| A2 | Important | Algorithmes | `DateUtils.toLocalDate` sensible au fuseau horaire (bug calendrier) |
| A3 | Important | Algorithmes | Chart.js jamais détruit dans `GraphsComponent` (fuite + rendu incorrect) |
| A4 | Important | Algorithmes | `ngOnChanges` accède à une clé potentiellement absente de `SimpleChanges` |
| A6 | Important | Algorithmes | Usage de la variable globale implicite `event` (non définie dans le scope) |
| AR1 | Important | Architecture | Aucun test automatisé dans tout le projet |
| AR2 | Important | Architecture | Composants "god object" (`calendar`, `workout-session`) |
| AR3 | Important | Architecture | Logique de swipe tactile dupliquée |
| S4 | Mineur (à qualifier) | Sécurité | Clé publique EmailJS en dur — normal pour EmailJS, restreindre le domaine |
| Q6-Q10 | Mineur | Qualité | Nommage, conventions `input()`/`output()`, a11y, typo pipe `plurial` |
| A7-A8 | Mineur | Algorithmes | Dark mode togglé sans garantie de cohérence, algo élastiques non mémoïsé |
| AR4-AR5 | Mineur | Architecture | Manipulation DOM native navbar, 16 fichiers de preset à factoriser |

**Les 5 points à traiter en priorité avant la suite du projet :**
1. **S1** — Sortir le refresh token (au minimum) du `localStorage`.
2. **A1** — Corriger la route cassée `list-exercises-muscle-group` (parcours utilisateur central).
3. **AR1** — Mettre en place une base de tests automatisés avant de toucher au design.
4. **Q1** — Activer `strict` dans `tsconfig.json` (révèle une bonne partie des bugs Q2/Q3/A4/A6).
5. **A2** — Corriger le calcul de date UTC qui décale le calendrier selon le fuseau/l'heure.
