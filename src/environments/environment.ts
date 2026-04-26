import { AppEnvironment } from './environment.model';

const apiBaseUrl = 'http://localhost:5078';
const appOrigin = typeof window === 'undefined' ? 'http://localhost:4200' : window.location.origin;

export const environment: AppEnvironment = {
  production: false,
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
