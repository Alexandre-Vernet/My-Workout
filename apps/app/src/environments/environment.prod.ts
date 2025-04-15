export const environment = {
  production: true,
  API_URL: 'https://my-workout-api.alexandre-vernet.fr/api',
  authUrl : () => `${ environment.API_URL }/auth`,
  workoutUrl : () => `${ environment.API_URL }/workout`,
    exerciseUrl : () => `${ environment.API_URL }/exercises`,
}
