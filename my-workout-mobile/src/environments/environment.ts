export const environment = {
    production: false,
    API_URL: 'http://localhost:3000/api',
    authUrl: () => `${ environment.API_URL }/auth`,
    muscleGroupUrl: () => `${ environment.API_URL }/muscle-group`,
    userExerciseUrl: () => `${ environment.API_URL }/user-exercise`,
    exerciseUrl: () => `${ environment.API_URL }/exercises`,
    historyUrl: () => `${ environment.API_URL }/history`,
    workoutUrl: () => `${ environment.API_URL }/workout`,
    EMAIL_JS: {
        PUBLIC_KEY: 'd3gvz9u7Hm4sLnK2e',
        SERVICE_ID: 'service_4b174bh',
        TEMPLATE_ID: 'template_6oukjrr'
    }
};
