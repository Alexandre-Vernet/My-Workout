export const statsI18n = {
    stats: {
        title: 'Statistiques',
        statsLoadError: 'Erreur lors de la récupération des statistiques',
        workoutSessionsLabel: (count: number) => `séance${ count === 1 ? '' : 's' } d'entraînement`,
        trackedExercisesLabel: (count: number) => `exercice${ count === 1 ? '' : 's' } suivi${ count === 1 ? '' : 's' }`,
        noStatsLine1: 'Pas encore de statistiques.',
        noStatsLine2: 'Commence une séance pour voir ta progression ici.',
        startWorkout: 'Lancer une séance',
        statsByExercise: 'Statistiques par exercice'
    },
    graphs: {
        periodLabels: {
            '1m': '1M',
            '3m': '3M',
            '6m': '6M',
            '1y': '1A',
            all: 'Tout'
        },
        datasetLabel: 'Charge utilisée',
        formatWeight: (value: number | string) => `${ value } kg`,
        totalWeight: 'Total soulevé',
        totalReps: 'Répétitions totales',
        maxWeight: 'Charge la plus lourde',
        allGymsFilter: 'Toutes les salles'
    }
};
