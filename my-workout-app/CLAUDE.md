# CLAUDE.md

Ce fichier donne le contexte et les règles à suivre pour travailler sur ce projet.

## Le projet

**My Workout** est une application Angular de suivi de musculation : on choisit un
groupe musculaire, on enchaîne les exercices d'une séance en loggant poids/répétitions,
un chronomètre de repos rythme les séries, et l'historique se retrouve dans un
calendrier et des statistiques de progression. Les données sont persistées côté
serveur (API Spring Boot `my-workout-api`, dans le dépôt parent, **hors scope** de ce
projet frontend) ; seuls le thème et les tokens d'authentification vivent dans le
`localStorage` du navigateur.

- `src/app/auth/` — authentification.
  - `auth.service.ts` : seul point d'accès aux tokens (`getAccessToken()`/`hasToken()`),
    met en cache `getCurrentUser()` (`shareReplay(1)`) pour éviter un appel `/auth/me`
    à chaque navigation — invalidé au login/déconnexion.
  - `auth.guard.ts` / `default-home-page.guard.ts` : guards fonctionnels qui vérifient
    d'abord le token en local puis valident côté serveur ; retournent un `UrlTree`
    (`router.createUrlTree(...)`), jamais un `router.navigate()` à côté d'un `return false`.
  - `auth.interceptor.ts` : pose le header `Authorization`, tente un refresh sur 401/403
    et rejoue la requête, échoue proprement en `Error('Unauthorized')` si le refresh
    n'a pas de refresh-token à utiliser.
  - `password-reset-token.service.ts`, `login/`, `register/`, `forgot-password/`,
    `reset-password/`, `auth.component.ts` (coquille `router-outlet`, aucune logique).
- `src/app/services/` — un service HTTP par domaine métier (`ExerciseService`,
  `HistoryService`, `MuscleService`, `MuscleGroupService`, `WorkoutService`) : de
  simples enveloppes autour de `HttpClient` qui construisent l'URL/les params et
  renvoient l'`Observable`, sans logique métier.
  - `alert.service.ts` / `rest-time.service.ts` : état partagé réactif, exposé en
    `signal()` directement (pas de `Subject`/`BehaviorSubject`) — voir
    [État : signaux et RxJS](#état--signaux-et-rxjs-où-tracer-la-limite).
- `src/app/navbar/` — pages de l'app (une page = un composant, jamais de logique dans
  `app.component.ts`) : `calendar/` (+ `history-detail/`), `library/`
  (`list-exercises/`, `view-exercise/`), `stats/` (+ `graphs/`), `view-profile/`
  (`manage-account/`, `change-theme/`, `account-actions/`, `admin/add-exercise/`),
  `workout/` (`select-muscle-group-workout/`, `workout-session/` + sa
  `exercises-table/`, `dialog-select-cardio-exercise/`). `navbar.component.ts` est le
  menu de navigation (bottom nav flottante, voir [Refonte visuelle](#refonte-visuelle)) :
  l'item actif est un `computed()` dérivé du signal de route (`toSignal(router.events)`),
  jamais de `document.querySelector`/`getBoundingClientRect` — ce composant a servi de
  premier exemple pour la refonte, s'en inspirer pour les écrans restants plutôt que
  de l'ancien pattern DOM qu'il remplace.
- `src/app/shared/` :
  - `alert/` : `AlertComponent` lit directement le signal de `AlertService` et gère
    l'auto-fermeture via un `effect()` (voir règle sur `effect()` plus bas).
  - `rest-time-banner/` : bandeau affiché hors de la page de séance quand un
    chrono de repos tourne ; `showBanner` est dérivé de `router.events` via
    `toSignal()`.
  - `directives/` : `swipe.directive.ts` (`appSwipe`, swipe tactile générique avec
    seuil et sélecteur d'exclusion — réutilisée par `calendar` et `workout-session`,
    ne pas réimplémenter un listener `touchstart`/`touchend` ad hoc ailleurs),
    `prevent-focus-on-button-click.directive.ts`.
  - `pipes/` : `plural.pipe.ts`, `rest-time.pipe.ts`, `difficulty-label.pipe.ts`,
    `mechanic-label.pipe.ts`, `first-letter-uppercase.pipe.ts`, `convert-time.pipe.ts`.
  - `theme/` : `theme.service.ts` (thème clair/sombre via la classe `.dark-mode` sur
    `<html>`, 17 presets `@primeuix/themes` dans `presets.ts`/`preset-*.ts` ;
    `theme.service.ts` injecte lui-même les variables CSS du thème via
    `@primeuix/styled` — PrimeNG, qui faisait ce travail avant sa suppression du
    projet, n'est plus dans la boucle).
  - `utils/` : fonctions pures sans classe — `date-utils.ts` (`toLocalDate` : construit
    la date depuis les composants **locaux**, jamais `toISOString()` qui décale d'un
    jour selon le fuseau), `http-error.ts` (voir
    [Erreurs HTTP](#erreurs-http--toujours-passer-par-http-errorts)),
    `remove-accents.ts`, `confirm-no-exercises-dialog.ts`
    (dialogue "aucun exercice ajouté" partagé entre `workout-session` et
    `select-muscle-group-workout`), `muscle-group-color.ts` (`getMuscleGroupColor`/
    `getMuscleGroupLabel` : seul point de lookup dans `muscleGroupMap`, réutilisé par
    `calendar`, `list-exercises` et `view-exercise` — voir
    [Refonte visuelle](#refonte-visuelle)).
  - `not-found/`, `menu-urls.ts` (enum des segments de route utilisés par le menu).
- `src/interfaces/` — types de données : une interface par fichier, nommé comme le
  type exporté, en **PascalCase** (`Exercise.ts`, `MuscleGroup.ts`, `Workout.ts`...).
  Un fichier historique déroge à la règle (`alert.ts`) : ne pas en ajouter d'autres
  sur ce modèle. `LoginRequest`/`RegisterRequest` sont les seules
  vraies `class` (constructeur), tout le reste est une `interface`, un `type` ou un
  `enum` — ne pas utiliser `class` pour une forme de donnée qui n'est jamais
  construite avec `new`.
- `src/environments/` — `environment.ts` (dev) / `environment.prod.ts`, builders d'URL
  d'API (`authUrl()`, `exerciseUrl()`...).
- `src/app/app.component.ts` — coquille : navbar + `router-outlet` + bandeau d'alerte
  + bandeau de repos, masque la navbar sur les pages d'auth, charge le thème au
  démarrage. Gère aussi, dans son constructeur, la détection de mise à jour du service
  worker (pas de service dédié — voir [PWA](#pwa)).
- `src/app/app.config.ts` — `provideRouter(appRoutes, withInMemoryScrolling(...), withComponentInputBinding())` :
  **les paramètres de route et query params sont liés directement aux `input()` du
  composant** (voir [Routing](#routing--withcomponentinputbinding) ci-dessous) ;
  `provideHttpClient(withInterceptors([authInterceptor]))` ; détection de changements
  **zoneless** (`provideZonelessChangeDetection()`, pas de `zone.js`) ;
  `provideServiceWorker(...)`.
- `src/global.scss` — reset, classes utilitaires ponctuelles (`.display-none`,
  `.disabled`, `.text-no-wrap`...) et variables CSS de thème (`:root` / `.dark-mode`),
  dont les tokens de la refonte visuelle (`--radius-lg/md/sm`, `--shadow-elevated`,
  `--surface-glass` — voir [Refonte visuelle](#refonte-visuelle)). PrimeFlex (classes
  utilitaires façon Tailwind) est chargé en CDN dans `index.html`, pas importé ici.
- `src/chips.scss` — partiel SCSS partagé (`@use`) par les chips de filtre par groupe
  musculaire de `calendar` et `list-exercises` (`.chips-container > ul > li`) : un seul
  endroit à modifier pour les deux écrans, ne pas dupliquer ce style en local.
- `public/manifest.webmanifest`, `public/icons/` (dossiers `android/`, `ios/`,
  `windows/`) — voir [PWA](#pwa).
- `ngsw-config.json` — cache du service worker (groupe `app` en prefetch pour
  html/css/js/manifest, groupe `assets` en lazy pour les images/fonts).
- `Dockerfile` / `nginx.conf` — image de prod (build Angular servi par nginx) ;
  `nginx.conf` sert tout via `try_files` sans en-têtes de cache spécifiques pour les
  fichiers hashés ni pour `index.html`/`ngsw.json` — à garder en tête si une mise à
  jour du service worker semble ne jamais être détectée en prod.
- `../.github/workflows/` (dépôt parent) — `test.yml` ne lance que les tests du
  **backend** (`mvn test`), sur `pull_request`. `docker-build-deploy.yml` construit et
  redéploie l'image sur chaque push sur `main`, **sans faire dépendre le déploiement
  des tests frontend** : les tests Vitest de ce projet ne sont pas branchés en CI.
- `AUDIT.md` — rapport d'audit (sécurité, qualité, algorithmes, architecture) réalisé
  sur ce projet ; la quasi-totalité des points qu'il liste a été corrigée depuis. Le
  consulter avant de ré-auditer le projet pour ne pas redécouvrir ce qui est déjà
  documenté et traité.

## Commandes

```bash
npm run serve   # ng serve — lance l'app en local
npm run build   # ng build — build de production
npm run lint    # ng lint — ESLint (@angular-eslint)
npm run test    # ng test — lance les tests (Vitest, via @angular/build:unit-test)
```

Toujours lancer `npm run test`, `npm run lint` et idéalement `npm run build` après une
modification.

## Tests

Chaque fonctionnalité ajoutée ou modifiée doit être complétée par des tests qui la
couvrent (`*.spec.ts`, Vitest) — pas seulement vérifier que les tests existants
passent toujours. Un bug corrigé doit avoir un test qui aurait échoué avant le
correctif (deux bugs réels ont été trouvés de cette façon dans ce projet : une
régression dans `ViewProfileComponent`/`ViewExerciseComponent` et un double appel
HTTP dans `ExercisesTableComponent` — voir les règles plus bas pour ne pas les
réintroduire).

- Une fonction pure (`shared/utils/*.ts`, un pipe) a son propre fichier de test qui
  couvre le cas nominal, les cas limites et les cas de repli.
- Un service HTTP se teste avec `HttpTestingController` (`provideHttpClient()` +
  `provideHttpClientTesting()`) : vérifier la méthode, l'URL, les params/le corps de
  la requête, puis `flush(...)` la réponse. Toujours `httpMock.verify()` en `afterEach`.
- Un composant avec des `input()` requis doit être testé via `TestBed.createComponent`
  + `fixture.componentRef.setInput(...)` — un `input.required<T>()` ne peut **pas**
  être renseigné autrement (pas d'instanciation directe possible).
- Un composant qui n'a **pas** d'`input.required` et qui embarque une librairie tierce
  lourde pour le DOM (FullCalendar dans `CalendarComponent`) peut être testé en
  instanciant la classe directement : `TestBed.runInInjectionContext(() => new X())`.
  Ça teste toute la logique métier sans monter la vue ni la librairie tierce, qui ne
  se nettoie pas proprement sous jsdom en fin de test.
- Chart.js (`GraphsComponent`) tolère l'absence de contexte 2D de `<canvas>` sous
  jsdom (juste un warning "Not implemented" dans la sortie, sans faire échouer le
  test) — pas de mock nécessaire.
- `RestTimeService.startTimer()` ne met à jour son signal `restTime` que dans le
  callback du `setInterval`, pas immédiatement à l'appel : dans un test, soit avancer
  le temps (`vi.useFakeTimers()` + `vi.advanceTimersByTime(...)`), soit appeler
  directement `restTimeService.restTime.set({...})` pour simuler un chrono en cours.
- Accéder à un membre `private`/`protected` depuis un test (ex. `component['nextStep']()`)
  est acceptable quand il n'y a pas d'alternative publique raisonnable, plutôt que
  d'affaiblir la visibilité du membre juste pour le rendre testable.

## Stack

- Angular 21, composants **standalone** (pas de `NgModule`).
- Détection de changements **zoneless** (`provideZonelessChangeDetection()`) — pas de
  `zone.js` dans le projet. Tout composant utilise `ChangeDetectionStrategy.OnPush` ;
  voir [État : signaux et RxJS](#état--signaux-et-rxjs-où-tracer-la-limite) pour ce
  que ça implique sur la façon d'écrire l'état rempli depuis un appel HTTP.
- `withComponentInputBinding()` : les paramètres de route et les query params sont
  liés automatiquement aux `input()` des composants (voir
  [Routing](#routing--withcomponentinputbinding)).
- Composants d'interface **from scratch** (plus de PrimeNG — retiré du projet) :
  partiels SCSS partagés (`buttons.scss`, `fields.scss`, `overlay.scss`,
  `skeleton.scss`, `chips.scss`, `sections.scss`) + quelques composants partagés
  (`ConfirmDialogComponent`, `ToggleSwitchComponent`, `NumberStepperComponent`).
  `@primeuix/themes`/`@primeuix/styled` restent (c'est le moteur des 17 presets de
  couleur, indépendant de PrimeNG — voir `shared/theme/theme.service.ts`). PrimeFlex
  (utilitaires CSS, chargé en CDN) reste disponible pour les écrans pas encore repris.
- RxJS pour les appels HTTP, guards et intercepteurs ; signaux (`signal`/`computed`/
  `effect`) pour l'état partagé réactif (`AlertService`, `RestTimeService`) et pour
  les `input()`/`output()`/`model()` des composants — voir la limite entre les deux
  dans [État : signaux et RxJS](#état--signaux-et-rxjs-où-tracer-la-limite).
- Chart.js (graphiques de progression).
- Tests avec Vitest (`*.spec.ts`), exécutés via `ng test` (builder
  `@angular/build:unit-test`, pas Karma/Jasmine).
- ESLint (`@angular-eslint`) via `ng lint`.
- **PWA** : service worker (`@angular/service-worker`) + manifeste installable. Voir
  la section [PWA](#pwa) plus bas.

## Routing : `withComponentInputBinding()`

Un paramètre de route (`:exerciseId`) ou un query param (`?tab=`) se récupère en
déclarant un `input()`/`input.required()` du même nom sur le composant — jamais en
injectant `ActivatedRoute` pour lire `snapshot.params`/`queryParamMap` à la main,
sauf besoin réel non couvert par ce mécanisme (ex. un `router.navigate` relatif à la
route courante). Exemples déjà en place : `exerciseId = input.required<number>()`
(`ViewExerciseComponent`, `GraphsComponent`), `token = input.required<string>()`
(`ResetPasswordComponent`), `muscleGroupId`/`tab` (`WorkoutSessionComponent`, `tab`
avec une fonction `transform` pour convertir la chaîne de query param en `number`).

## PWA

- `public/manifest.webmanifest` / `public/icons/` : nom, couleurs et icônes de l'app,
  déjà cohérents avec l'identité du produit — en cas de régénération, vérifier que
  chaque entrée `icons` du manifeste pointe vers un fichier qui existe réellement,
  avec la taille déclarée (`sizes`) qui correspond aux dimensions réelles.
- `ngsw-config.json` : si un nouveau type de fichier statique est ajouté dans
  `public/`, vérifier qu'il est bien couvert par un `assetGroups` existant.
- `app.config.ts` : `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })`
  — désactivé en dev. `ng serve` ne l'active jamais : pour le tester, `npm run build`
  puis servir `www/browser` (ex. `npx http-server www/browser`).
- **Détection de mise à jour** : gérée directement dans le constructeur d'`app.component.ts`
  (derrière `environment.production`), pas par un service dédié : `swUpdate.checkForUpdate()`
  une fois, puis `window.location.reload()` dès qu'un `VERSION_READY` arrive sur
  `versionUpdates`. Il n'y a **pas** de bandeau "nouvelle version disponible" ni de
  nouvelle vérification périodique une fois l'app ouverte — si on ajoute l'un ou
  l'autre, s'appuyer sur ce hook existant plutôt que d'en créer un second en parallèle.
- `nginx.conf` ne fixe aucun en-tête de cache spécifique : si une mise à jour de l'app
  en prod semble ne jamais être détectée par les clients déjà ouverts, vérifier en
  premier que `index.html`/`ngsw.json`/le manifeste ne sont pas mis en cache trop
  longtemps par un intermédiaire (CDN, navigateur) avant de chercher ailleurs.

## Règles de base TypeScript

- `strict: true` **et** `noUnusedLocals`/`noUnusedParameters` activés dans
  `tsconfig.json` — ne jamais les affaiblir pour faire passer un build ; corriger le
  code, pas le flag.
- Pas de `any`. Si un type est difficilement exprimable, créer une interface/type
  dédié plutôt que d'élargir le typage.
- `const` par défaut ; `let` seulement si la variable est réellement réassignée.
- Pas de valeurs magiques répétées : extraire une constante nommée (ex.
  `AUTO_HIDE_DELAY_MS` dans `alert.component.ts`).
- Une fonction = une responsabilité.

## Règles de base Angular

- Composants **standalone**, jamais de `NgModule`.
- `changeDetection: ChangeDetectionStrategy.OnPush` sur tout composant — cohérent avec
  l'app zoneless (voir [Stack](#stack)), pas d'exception.
- Syntaxe de template `@if`/`@for`/`@switch`, jamais `*ngIf`/`*ngFor`.
- Injection via `inject()`, jamais via le constructeur — y compris dans les guards et
  intercepteurs fonctionnels (`const x = inject(Y)`).
- `input()` / `output()` / `model()` (signal-based) pour toute communication
  parent/enfant, jamais `@Input()`/`@Output()` ni `EventEmitter` direct. Un `model()`
  pour une valeur liée en two-way (`[(ouvert)]`), pas une paire manuelle
  `@Input()`/`@Output() xChange`.
- Un service HTTP par domaine métier, suffixé `Service`, annoté
  `@Injectable({ providedIn: 'root' })` : construit l'URL/les params et renvoie
  l'`Observable`, sans logique métier dans le service — celle-ci reste dans le
  composant appelant.
- Un composant ne doit pas connaître les détails d'implémentation d'un autre : il
  passe par les `input`/`output` exposés, jamais par un accès direct à l'état interne.

### Visibilité des membres

- `private readonly` par défaut pour tout ce qui n'est utilisé que dans la classe —
  en particulier **tout** service injecté (`private readonly exerciseService = inject(ExerciseService)`).
- `protected readonly` uniquement pour ce qui est lu depuis le template du composant
  (ex. `protected readonly restTimeService = inject(RestTimeService)` quand le
  template fait `restTimeService.restTime()`).
- `public` (sans modificateur) réservé à l'API réellement consommée depuis
  l'extérieur de la classe.
- `readonly` sur toute propriété jamais réassignée après initialisation (signaux
  compris).

## Règles spécifiques à ce projet

### État : signaux et RxJS, où tracer la limite

L'app est **zoneless** (voir [Stack](#stack)) : rien ne déclenche plus
automatiquement un cycle de détection de changement après un callback asynchrone
quelconque (c'était le rôle de `zone.js`). Angular ne replanifie un rendu que sur un
signal qui change, un événement DOM lié via un binding de template, le pipe `async`,
ou un appel explicite à `ChangeDetectorRef.markForCheck()`. Ça fixe la règle
ci-dessous, qui n'est plus affaire de goût mais de correction :

- État partagé réactif entre composants (alerte courante, chrono de repos en cours) :
  toujours un `signal()` exposé directement par le service (`AlertService.alert`,
  `RestTimeService.restTime`), lu dans le template via l'appel du signal
  (`alertService.alert()`) — jamais réenveloppé dans un champ local mis à jour par un
  `subscribe()` manuel.
- Tout champ de classe lu dans le template et rempli/modifié de façon asynchrone
  (réponse HTTP, `debounceTime`/`switchMap` sur un `FormControl`, etc.) devient un
  `signal()` plutôt qu'un champ simple réassigné dans un `subscribe()` : sans ça, rien
  ne notifie Angular que la donnée a changé une fois la réponse arrivée (plus de
  `zone.js` pour le faire implicitement), et l'écran reste bloqué sur son état
  précédent. Deux façons de l'écrire selon le cas :
  - **Passthrough direct** d'un seul flux, sans autre site de mutation : `toSignal()`
    sur l'Observable. Exemple : `protected readonly user = toSignal(this.authService.getCurrentUser());`.
  - **État mis à jour depuis plusieurs endroits** (le chargement initial *et* une
    méthode appelée plus tard, ex. `filterExercise()`) : un `signal()` classique
    déclaré sur le composant, rempli par `.set()`/`.update()` à chaque site de
    mutation (y compris dans le `subscribe()` initial) — c'est le même pattern que
    `detailOpen`/`selectedPeriod` déjà en place, pas un nouveau concept.
- Un `subscribe()` RxJS classique reste légitime quand l'appel a un **effet de bord**
  plutôt qu'une donnée à afficher (navigation, `AlertService`, create/update/delete
  suivi d'un refetch) : dans ce cas, si le callback met quand même à jour un champ lu
  par le template (ex. remettre `isLoading` à `false`), soit ce drapeau est lui-même un
  `signal()` (préféré, cohérent avec la règle ci-dessus), soit à défaut injecter
  `ChangeDetectorRef` et appeler `markForCheck()` dans le callback.
- `toSignal()` reste aussi le choix pour une valeur dérivée d'un flux qui vit plus
  longtemps qu'un composant (ex. `RestTimeBannerComponent.showBanner`, dérivé de
  `router.events`) — ce cas-là ne change pas.
- `effect()` est réservé aux effets de bord réels réagissant à un signal (ex.
  minuteur d'auto-fermeture de `AlertComponent`), jamais pour calculer une valeur qui
  devrait être un `computed()`.

### Erreurs HTTP : toujours passer par `http-error.ts`

- Ne jamais lire `err.error.xxx` directement dans un callback d'erreur : `err.error`
  peut être absent (timeout, serveur injoignable, CORS), ce qui plante le handler
  d'erreur lui-même. Toujours passer par `getErrorCode`/`getErrorMessage`/
  `isValidationError`/`applyValidationErrors` (`shared/utils/http-error.ts`).
- Une erreur de validation renvoyée par le serveur (`type: 'VALIDATION'`) se mappe
  sur un `FormGroup` via `applyValidationErrors(err, formGroup)`, pas en recopiant la
  boucle `err.error.errors.forEach(...)` dans chaque composant.
- Un dialogue de confirmation répété à l'identique (ex. "aucun exercice ajouté") se
  factorise dans `shared/utils/` (voir `confirm-no-exercises-dialog.ts`) plutôt que
  d'être copié-collé entre composants.

### Nullabilité d'un champ rempli de façon asynchrone

- Un champ rempli dans `ngOnInit()` par un `subscribe()` (ex. `user`) ne doit **jamais**
  porter une assertion de non-nullité (`user!: Type`) si le template le lit avant que
  la requête ait répondu : le typer `Type | undefined` et garder `?.` dans le
  template. Le `!` ne trompe que le compilateur, pas le premier rendu — c'est
  exactement ce qui a cassé `ViewProfileComponent` et `ViewExerciseComponent` (`user.admin`
  plantait tant que `/auth/me` n'avait pas répondu).
- Un champ protégé par un `@if` qui le rend sûr avant d'être lu (ex. `exerciseMuscle`
  derrière `@if (!exerciseMuscle) { ... } @else { ... exerciseMuscle.exercise! ... }`)
  peut garder son `!` : le garde structurel le rend réellement sûr à l'exécution, ce
  n'est pas qu'une déclaration de type.

### `ngOnChanges` et `ngOnInit` sur le même input

- Angular déclenche `ngOnChanges` avec `firstChange: true` **avant** `ngOnInit()`, dès
  le premier binding d'un input. Si `ngOnInit()` charge déjà des données à partir de
  cet input, `ngOnChanges` ne doit réagir qu'aux changements **suivants**
  (`changes['x'] && !changes['x'].firstChange && ...`), sinon le chargement initial
  part en double (bug réel corrigé dans `ExercisesTableComponent`).

### Langue : code en anglais, contenu utilisateur en français

- Noms de fichiers, classes, variables, sélecteurs et commentaires : toujours en
  anglais clair (ex. le pipe `plural.pipe.ts`/`PluralPipe`, pas `pluriel`).
- Le contenu visible par l'utilisateur (messages d'alerte, labels, noms d'exercices/
  d'élastiques/de difficultés) reste en **français** : l'app est destinée à des
  utilisateurs francophones, ne pas traduire ce contenu sans demande explicite.
- Un commentaire n'est utile que pour expliquer un *pourquoi* non évident (ex. le
  fuseau horaire dans `date-utils.ts`) — jamais pour décrire une action qu'on vient
  de faire ou répéter ce que le code dit déjà.

## Nommage

- Composants : dossier dédié `nom-du-composant/` avec `nom-du-composant.component.ts`/
  `.html`/`.scss`.
- Services : `nom.service.ts`, suffixés `Service`, jamais `Store`/`Manager`/`Helper`.
- Guards : `nom.guard.ts`, fonction `nomGuard`. Intercepteurs : `nom.interceptor.ts`,
  fonction `nomInterceptor`.
- Pipes : `nom.pipe.ts`, classe `NomPipe`, nom du pipe en camelCase (`plural`,
  `restTime`, `difficultyLabel`...).
- Directives : `nom.directive.ts`, sélecteur en camelCase préfixé `app`
  (`appSwipe`, `appPreventFocusOnButtonClick`).
- Modèles de données (`src/interfaces/`) : un fichier par type, nommé comme le type
  exporté, en **PascalCase** (`Exercise.ts`, pas `exercise.model.ts`).
- Fonctions utilitaires pures (`src/app/shared/utils/`) : fichier en kebab-case sans
  suffixe (`date-utils.ts`), pas de classe quand une fonction suffit.
