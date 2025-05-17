export enum ErrorCode {
    emailAlreadyInUse = 'emailAlreadyInUse',
    passwordNotMatch = 'passwordNotMatch',
    invalidCredential = 'invalidCredential',
    userMustBeLoggedToContinue = 'userMustBeLoggedToContinue',
    muscleGroupDoesntExist = 'muscleGroupDoesntExist',
    duplicateWorkout = 'duplicateWorkout'
}

export const errorMessages = new Map<ErrorCode, string>([
    [ErrorCode.emailAlreadyInUse, 'Cet email est déjà utilisé'],
    [ErrorCode.passwordNotMatch, 'Les mots de passe ne correspondent pas'],
    [ErrorCode.invalidCredential, 'Email ou mot de passe invalide'],
    [ErrorCode.userMustBeLoggedToContinue, 'Vous devez être connecté pour continuer'],
    [ErrorCode.muscleGroupDoesntExist, 'Ce groupe musculaire n\'existe pas'],
    [ErrorCode.duplicateWorkout, 'Vous avez déjà réalisé cette séance aujourd’hui.']
]);
