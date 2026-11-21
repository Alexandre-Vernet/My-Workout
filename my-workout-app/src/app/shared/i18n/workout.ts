export const workoutI18n = {
    selectMuscleGroup: {
        title: 'Sélectionner une séance',
        recommendedBadge: 'Recommandé',
        exerciseCountLabel: (count: number) => `${ count } exercice${ count <= 1 ? '' : 's' }`
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
        weightSuffix: ' kg',
        repsSuffix: (count: number) => count <= 1 ? ' rep' : ' reps',
        fetchExercisesErrorMessage: 'Impossible d\'afficher les exercices',
        saveErrorMessage: 'Erreur lors de l\'enregistrement'
    },
    exercisesTable: {
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
