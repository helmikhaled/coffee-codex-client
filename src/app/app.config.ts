import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { environment } from '../environments/environment';
import { buildAuthProviderConfig, hasAuthProviderConfiguration } from './core/auth/auth-provider.config';
import { routes } from './app.routes';

const authConfigured = hasAuthProviderConfiguration(environment.auth);

const authProviders = authConfigured
  ? [
      provideAuth0(buildAuthProviderConfig(environment.auth)),
    ]
  : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    authConfigured ? provideHttpClient(withInterceptors([authHttpInterceptorFn])) : provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    ...authProviders,
  ],
};
