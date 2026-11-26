export const workoutI18n = {
    selectMuscleGroup: {
        title: 'Sélectionner une séance',
        recommendedBadge: 'Recommandé',
        exerciseCountLabel: (count: number) => `${ count } exercice${ count <= 1 ? '' : 's' }`,
        noGymTitle: 'Aucune salle',
        noGymMessage: 'Vous devez créer une salle avant de pouvoir lancer un entraînement.',
        noGymCta: 'Créer une salle'
    },
    gymPicker: {
        title: 'Dans quelle salle ?',
        closeLabel: 'Fermer'
    },
    dialogSelectCardioExercise: {
        title: 'Sélectionner un type d\'entraînement',
        closeLabel: 'Fermer',
        durationSuffix: ' min',
        validateLabel: 'Valider',
        createdSuccessMessage: (exerciseName: string | undefined) => `L'entraînement ${ exerciseName } a été créé avec succès`,
        createErrorMessage: 'Impossible de créer l\'entraînement'
    },
    workoutSession: {
        unilateralLabel: 'Unilatéral',
        weightLabel: 'Poids',
        repsLabel: 'Répétitions',
        weightSuffix: ' kg',
        repsSuffix: (count: number) => count <= 1 ? ' rep' : ' reps',
        exerciseProgressLabel: (step: number, total: number) => `Exercice ${ step } sur ${ total }`,
        viewDetailHint: 'Voir le détail',
        startSetLabel: 'Démarrer la série',
        restInProgressLabel: 'Repos en cours',
        timerStartAriaLabel: 'Démarrer le chronomètre de repos',
        timerStopAriaLabel: 'Arrêter le chronomètre de repos',
        fetchExercisesErrorMessage: 'Impossible d\'afficher les exercices',
        saveErrorMessage: 'Erreur lors de l\'enregistrement'
    },
    exercisesTable: {
        historyTitle: 'Séries du jour',
        historyCountLabel: (count: number) => count <= 1 ? `${ count } série` : `${ count } séries`,
        emptyStateTitle: 'Aucune série enregistrée',
        emptyStateMessage: 'Vos séries apparaîtront ici dès que vous en enregistrerez une.',
        weightHeader: 'Poids',
        repsHeader: 'Reps',
        unilateralHeader: 'Unilat.',
        restHeader: 'Repos',
        weightSuffix: ' kg',
        unilateralAriaLabel: 'Unilatéral',
        deleteAriaLabel: 'Supprimer',
        updateSuccessMessage: 'Mise à jour réussie',
        updateErrorMessage: 'Impossible de mettre à jour',
        deleteErrorMessage: 'Erreur lors de la suppression',
        fetchHistoryErrorMessage: 'Erreur lors de la récupération de l\'historique'
    },
    noExercisesDialog: {
        title: 'Attention',
        message: 'Vous n\'avez ajouté aucun exercice à votre bibliothèque. Commencez par en ajouter pour pouvoir lancer un entraînement.',
        confirmLabel: 'Ajouter',
        cancelLabel: 'Annuler'
    }
};
