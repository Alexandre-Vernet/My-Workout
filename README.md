# My-Workout

<a href="http://my-workout.alexandre-vernet.fr/" target="_blank" rel="noreferrer">
<img alt="my-workout logo" src="https://raw.githubusercontent.com/Alexandre-Vernet/My-Workout/refs/heads/main/apps/app/public/favicon.ico" width="45">
</a>

## Introduction

My-Workout est une application de suivi pour les pratiquants de musculation. Elle permet d'enregistrer et de suivre une progression sur une série d'exercices. Vous pouvez enregistrer le nombre de répétitions, de série et la charge utilisée. Ces séances peuvent être visualisées depuis un calendrier ou depuis la page historique.

Vous pouvez définir un programme en choisissant vos exercices depuis une bibliothèque et agencer votre séance en choisissant l'ordre de vos exercices.

## Fonctionnalités

- Bibliothèque d'exercices avec description et animation du mouvement
- Sélection d'exercices pour chaque groupe musculaire parmi ceux présents dans la bibliothèque
- Calendrier de suivi de séances
- Enregistrement d'une séance avec le nombre de séries, de répétitions et la charge utilisée lors de l'exercice
- Chronomètre intégré à l'entraînement pour les temps de repos
- Suggestion de séance
- Historique de séance
- Personnalisation de l'application pour changer le thème + thème sombre
- Authentification

### Bibliothèque

L'application recense une 100ène d'exercices dans la bibliothèque. Chacun de ces exercices peuvent être ajouté à un entraînement et vous seront affiché lors de vos entraînements afin d'enregistrer la séance.

![apercu bibliothèque](https://github.com/user-attachments/assets/b1443344-93dd-48a4-b05e-7baafbf730bc)

Choisissez un groupe musculaire pour ajouter / supprimer des exercices.

![groupe musculaire biceps](https://github.com/user-attachments/assets/130a583b-52ed-4da1-b0f7-4868253ef3ed)

Des filtres sont disponibles pour chaque groupe musculaire pour cibler une portion précise d'un muscle.

Au clic du bouton favori, l'exercice sera ajouté à votre séance. Vous pouvez également changer l'ordre des exercices afin de commencer un exercice avant un autre.

### Détail d'un exercice

Vous pouvez cliquer sur un exercice pour y afficher une description de l'exercice ainsi qu'une animation du mouvement.

En bas de la page, vous aurez de nouveau la possibilité d'ajouter / supprimer cet exercice à la séance.

![detail exercice](https://github.com/user-attachments/assets/a4bc38a8-e577-4638-8db9-b23d05be31fd)

### Calendrier

Le calendrier répertorie l'ensemble des séances réalisées. Vous pourrez filtrer par groupe musculaire pour n'afficher que lui. Au clic d'une séance, vous pourrez visualiser le détail d'une séance.

Swipez vers la gauche / droite pour changer de mois.

![calendrier](https://github.com/user-attachments/assets/8e2cef8b-075d-48be-ab2b-d977b567bd3c)

Cliquez sur un jour pour ajouter une séance de cardio.

![ajouter seance cardio](https://github.com/user-attachments/assets/bd988a3b-8cd7-4647-a76a-0c44578b4313)

## Enregistrer une séance

Cette partie de l'application concerne l'enregistrement d'une séance. Il s'agit du point clé de l'application.

#### 1. Sélectionner un entraînement
   Vous pourrez ici choisir un groupe musculaire à travailler et démarrer une séance.

L'application recommande la plus ancienne des séances effectuées.

![choisir entrainement](https://github.com/user-attachments/assets/5f4f42f9-c34e-4a45-a86a-e4a6840eb777)

#### 2. Aperçu

Vous retrouverez tout en haut de l'écran les exercices à effectuer durant la séance choisi (trier selon votre préférence définie depuis la bibliothèque). Dans notre exemple, nous avons 4 exercices, vous pouvez cliquer sur un des numéros pour changer d'exercice ou swiper vers la gauche / droite.

Augmentez / diminuez la charge utilisée via les boutons + ou moins ou en entrant un nombre dans le champ. Même principe pour les répétitions.

Pour la charge à utiliser, le champ est pré-rempli avec la charge la plus élevée qui a été utilisé lors la dernière séance (ici curl biceps).

![apercu entrainement](https://github.com/user-attachments/assets/b9da1985-b1d9-49fd-a48c-ff03e4dbf550)

#### 3. Chronomètre
   Une fois votre série effectuée, cliquez sur l'icône du chronomètre pour lancer ce dernier. Une fois lancé, un tableau apparaîtra pour afficher :

- Le numéro de la série
- La charge utilisée
- Le nombre de répétitions
- Le temps de repos (vide tant qu'on n'arrête pas le chronomètre)

En appuyant de nouveau sur le chronomètre, ce dernier s'arrête, ajoute le temps de repos dans le tableau et vous pouvez démarrer une nouvelle série. Refaite ce circuit jusqu'à vouloir changer d'exercice.

En cas de fermeture de l'application ou changement de page, les données sont conservées et seront de nouveau affichées (sauf le temps de repos qui n'est pas sauvegardé).

![chronometre](https://github.com/user-attachments/assets/34a9711b-3ec0-4e9a-8398-48d16a17ae7f)

#### 4. Fin de séance
   Une fois la séance terminée, vous pourrez la visualiser depuis le calendrier ou depuis la page historique.

### Historique

La partie historique détaille chaque séance effectuée avec le nombre de séries, de répétitions et la charge soulevée.

Vous pouvez supprimer une séance en cliquant sur la corbeille

![historique](https://github.com/user-attachments/assets/f9399789-2816-41a1-8a93-948312a7e15d)

### Mon compte

La section mon compte permet de modifier des informations de l'utilisateur : mail / mot de passe

Vous pourrez aussi y changer de thème parmi les 17 proposés et activer / désactiver le mode sombre.

![mon compte](https://github.com/user-attachments/assets/0f7dac19-35d2-4687-a656-c31df3b8b512)

### Authentification

L'application propose une authentification pour sauvegarder vos données. Vous pouvez vous connecter avec un compte déjà existant ou en créer un nouveau.
Vos données seront sauvegardées dans une base de données et vous pourrez y accéder depuis n'importe quel appareil.

#### 1. Page de connexion

Connectez-vous avec votre email et mot de passe. Si vous n'avez pas de compte, vous pouvez en créer un en cliquant sur le lien "Pas encore inscrit ?".

![page de connexion](https://github.com/user-attachments/assets/8bb3f0ca-6eb8-444b-bc4a-38a5f8afefe5)

#### 2. Page d'inscription
   Créez un compte en remplissant le formulaire avec votre email et mot de passe.

![Page d inscription](https://github.com/user-attachments/assets/349e1fde-11e8-496b-8781-ec3709a3dc97)

#### 3. Mot de passe oublié

Cliquez sur le bouton "Mot de passe oublié ?" pour réinitialiser votre mot de passe. Un email vous sera envoyé avec un lien pour réinitialiser votre mot de passe.

![mot de passe oublié](https://github.com/user-attachments/assets/8141f960-72b6-4048-b1bc-def09e7bdd7d)
