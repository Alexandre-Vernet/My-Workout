export enum ErrorCode {
    emailAlreadyInUse = 'emailAlreadyInUse',
    passwordNotMatch = 'passwordNotMatch',
    invalidCredential = 'invalidCredential',
    userMustBeLoggedToContinue = 'userMustBeLoggedToContinue',
    muscleGroupDoesntExist = 'muscleGroupDoesntExist',
}

export const errorMessages = new Map<ErrorCode, string>([
    [ErrorCode.emailAlreadyInUse, 'Cet email est déjà utilisé'],
    [ErrorCode.passwordNotMatch, 'Les mots de passe ne correspondent pas'],
    [ErrorCode.invalidCredential, 'Email ou mot de passe invalide'],
    [ErrorCode.userMustBeLoggedToContinue, 'Vous devez être connecté pour continuer'],
    [ErrorCode.muscleGroupDoesntExist, 'Ce groupe musculaire n\'existe pas'],
]);
