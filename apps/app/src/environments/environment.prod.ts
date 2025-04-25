export const environment = {
    production: true,
    API_URL: 'https://my-workout-api.alexandre-vernet.fr/api',
    authUrl: () => `${ environment.API_URL }/auth`,
    muscleGroupUrl: () => `${ environment.API_URL }/muscle-group`,
    userExerciseUrl: () => `${ environment.API_URL }/user-exercise`,
    exerciseUrl: () => `${ environment.API_URL }/exercises`
};
