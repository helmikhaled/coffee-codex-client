export type AuthHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ProtectedApiRouteConfig {
  uri: string;
  httpMethod?: AuthHttpMethod;
}

export interface AuthEnvironmentConfig {
  domain: string;
  clientId: string;
  audience: string;
  redirectUri: string;
  logoutReturnUri: string;
  protectedApiRoutes: ProtectedApiRouteConfig[];
}

export interface AppEnvironment {
  production: boolean;
  apiBaseUrl: string;
  auth: AuthEnvironmentConfig;
}
