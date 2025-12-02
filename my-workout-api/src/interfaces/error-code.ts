export enum ErrorCode {
    emailAlreadyInUse = 'emailAlreadyInUse',
    passwordNotMatch = 'passwordNotMatch',
    invalidCredential = 'invalidCredential',
    sessionHasExpired = 'sessionHasExpired',
    muscleGroupDoesntExist = 'muscleGroupDoesntExist',
    exerciseDoesntExist = 'exerciseDoesntExist',
}

export const errorMessages = new Map<ErrorCode, string>([
    [ErrorCode.emailAlreadyInUse, 'Cet email est déjà utilisé'],
    [ErrorCode.passwordNotMatch, 'Les mots de passe ne correspondent pas'],
    [ErrorCode.invalidCredential, 'Email ou mot de passe invalide'],
    [ErrorCode.sessionHasExpired, 'Votre session a expirée, veuillez vous reconnecter'],
    [ErrorCode.muscleGroupDoesntExist, 'Ce groupe musculaire n\'existe pas'],
    [ErrorCode.exerciseDoesntExist, 'Cet exercice n\'existe pas'],
]);
