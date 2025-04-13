export const environment = {
  production: true,
  API_URL: 'https://my-workout.alexandre-vernet.fr/api',
  authUrl : () => `${ environment.API_URL }/auth`,
}
