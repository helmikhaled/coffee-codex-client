import { AppEnvironment } from './environment.model';

const apiBaseUrl =
  'https://coffee-codex-api.lemonwave-0a753557.southeastasia.azurecontainerapps.io';
const appOrigin = typeof window === 'undefined' ? 'http://localhost:4200' : window.location.origin;

export const environment: AppEnvironment = {
  production: true,
  apiBaseUrl,
  auth: {
    domain: 'hlmkhld.us.auth0.com',
    clientId: 'fmKbLzpaVCntTKxcmU7urhwrBXQnsqNP',
    audience: 'https://api.coffeecodex.my',
    redirectUri: appOrigin,
    logoutReturnUri: appOrigin,
    protectedApiRoutes: [
      { uri: `${apiBaseUrl}/recipes`, httpMethod: 'POST' },
      { uri: `${apiBaseUrl}/recipes/*`, httpMethod: 'PUT' },
      { uri: `${apiBaseUrl}/recipes/*`, httpMethod: 'DELETE' },
      { uri: `${apiBaseUrl}/recipes/*/images`, httpMethod: 'POST' },
    ],
  },
};
