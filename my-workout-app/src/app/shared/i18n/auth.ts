export const authI18n = {
    guard: {
        accessDenied: 'Vous devez être connecté pour accéder à cette page'
    },
    login: {
        title: 'Connexion',
        emailPlaceholder: 'Email',
        emailInvalid: 'L\'email n\'est pas valide',
        badCredential: 'Email ou mot de passe invalide',
        tooManyAttempts: 'Trop de tentatives de connexion, réessayez dans quelques minutes',
        passwordPlaceholder: 'Mot de passe',
        submit: 'Connexion',
        forgotPassword: 'Mot de passe oublié',
        registerLink: 'Pas encore inscrit ? Créez un compte ici'
    },
    register: {
        title: 'Créer un compte',
        emailPlaceholder: 'Email',
        emailInvalid: 'L\'email n\'est pas valide',
        emailAlreadyInUse: 'Cet email est déjà utilisé',
        unknownError: 'Une erreur s\'est produite',
        passwordPlaceholder: 'Mot de passe',
        passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        confirmPasswordPlaceholder: 'Confirmer le mot de passe',
        submit: 'S\'inscrire',
        loginLink: 'Déjà membre ? Connectez-vous ici'
    },
    forgotPassword: {
        title: 'Mot de passe oublié',
        close: 'Fermer',
        subtitle: 'Entrez votre email pour recevoir un mail de réinitialisation de mot de passe',
        emailLabel: 'Email',
        emailInvalid: 'L\'email n\'est pas valide',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        successMessage: 'Si un compte existe pour cet email, un lien de réinitialisation vous a été envoyé',
        errorFallback: 'Une erreur s\'est produite, veuillez réessayer'
    },
    resetPassword: {
        title: 'Réinitialiser le mot de passe',
        subtitle: 'Taper votre nouveau mot de passe',
        passwordLabel: 'Mot de passe',
        passwordInvalid: 'Le mot de passe n\'est pas valide',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
        confirmPasswordLabel: 'Confirmer le mot de passe',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        passwordsDoNotMatch: 'Passwords do not match',
        errorFallback: 'Une erreur s\'est produite'
    }
};
