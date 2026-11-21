export const calendarI18n = {
    calendar: {
        weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        sessionCount: (count: number) => `${ count } séance${ count > 1 ? 's' : '' } ce mois-ci`,
        allFilter: 'Tous',
        monthSessionsTitle: 'Séances du mois',
        noSessions: (hasFilter: boolean) => `Aucune séance ${ hasFilter ? 'pour ce groupe ' : '' }ce mois-ci`,
        closeSheet: 'Fermer',
        deleteSession: 'Supprimer cette séance',
        deleteConfirmTitle: 'Attention',
        deleteConfirmLabel: 'Supprimer',
        cancelLabel: 'Annuler',
        deleteConfirm: (muscleGroupName: string, date: string) =>
            `Voulez-vous vraiment supprimer l'entraînement ${ muscleGroupName } du ${ date } ?`,
        deleteSuccess: 'Suppression effectuée',
        deleteError: 'Impossible de supprimer l\'entraînement',
        loadError: 'Impossible d\'afficher le calendrier'
    },
    historyDetail: {
        repSingular: 'répétition',
        repPlural: 'répétitions',
        unilateralMarker: '(unilatéral)',
        timesSeparator: 'x',
        weightUnit: 'kg'
    }
};
