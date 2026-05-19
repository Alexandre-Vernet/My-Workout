export const environment = {
    appName: 'My-Workout',
    logoUrl: 'https://github.com/Alexandre-Vernet/My-Workout/blob/main/my-workout-app/public/icons/icon.png?raw=true',
    production: false,
    API_URL: 'http://localhost:8080/api',
    authUrl: () => `${ environment.API_URL }/auth`,
    muscleGroupUrl: () => `${ environment.API_URL }/muscle-group`,
    muscleUrl: () => `${ environment.API_URL }/muscle`,
    userExerciseUrl: () => `${ environment.API_URL }/user-exercise`,
    exerciseUrl: () => `${ environment.API_URL }/exercises`,
    historyUrl: () => `${ environment.API_URL }/history`,
    workoutUrl: () => `${ environment.API_URL }/workout`,
    passwordResetTokenUrl: () => `${ environment.API_URL }/password-reset-token`,
    EMAIL_JS: {
        PUBLIC_KEY: 'd3gvz9u7Hm4sLnK2e',
        SERVICE_ID: 'service_4b174bh',
        TEMPLATE_ID: 'template_6oukjrr'
    }
};
