import { AuthConfig, HttpInterceptorRouteConfig } from '@auth0/auth0-angular';
import { AuthEnvironmentConfig } from '../../../environments/environment.model';

export function hasAuthProviderConfiguration(auth: AuthEnvironmentConfig): boolean {
  return auth.domain.trim().length > 0 && auth.clientId.trim().length > 0;
}

export function buildProtectedApiAllowedList(auth: AuthEnvironmentConfig): HttpInterceptorRouteConfig[] {
  return auth.protectedApiRoutes.map((route) => ({
    uri: route.uri,
    httpMethod: route.httpMethod,
    allowAnonymous: false,
    tokenOptions: {
      authorizationParams: {
        audience: auth.audience,
      },
    },
  }));
}

export function buildAuthProviderConfig(auth: AuthEnvironmentConfig): AuthConfig {
  return {
    domain: auth.domain,
    clientId: auth.clientId,
    authorizationParams: {
      audience: auth.audience,
      redirect_uri: auth.redirectUri,
    },
    httpInterceptor: {
      allowedList: buildProtectedApiAllowedList(auth),
    },
    errorPath: '/',
  };
}
