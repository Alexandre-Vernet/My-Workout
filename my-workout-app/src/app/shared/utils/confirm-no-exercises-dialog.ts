import { ConfirmationService } from 'primeng/api';

export function confirmNoExercisesAdded(confirmationService: ConfirmationService, onAccept: () => void, onReject: () => void) {
    confirmationService.confirm({
        header: 'Attention',
        message: `Vous n'avez ajouté aucun exercice à votre bibliothèque.<br/>Commencez par en ajouter pour pouvoir lancer un entraînement.`,
        closable: true,
        closeOnEscape: true,
        dismissableMask: true,
        icon: 'pi pi-exclamation-triangle',
        acceptButtonProps: {
            label: 'Ajouter'
        },
        rejectButtonProps: {
            label: 'Annuler',
            severity: 'secondary',
            outlined: true
        },
        accept: onAccept,
        reject: onReject
    });
}
