export const environment = {
    production: false,
    API_URL: 'http://localhost:3000/api',
    authUrl: () => `${ environment.API_URL }/auth`,
    muscleGroupUrl: () => `${ environment.API_URL }/muscle-group`,
    userExerciseUrl: () => `${ environment.API_URL }/user-exercise`,
    exerciseUrl: () => `${ environment.API_URL }/exercises`

};
