export const environment = {
  production: false,
  API_URL: 'http://localhost:3000/api',
  authUrl : () => `${ environment.API_URL }/auth`,
  workoutUrl : () => `${ environment.API_URL }/workout`,
  exerciseUrl : () => `${ environment.API_URL }/exercises`,
}
