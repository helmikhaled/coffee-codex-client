import { HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthClientConfig, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { firstValueFrom, of } from 'rxjs';
import { AuthEnvironmentConfig } from '../../../environments/environment.model';
import { buildAuthProviderConfig } from './auth-provider.config';

describe('AuthHttpInterceptor integration', () => {
  const authEnvironment: AuthEnvironmentConfig = {
    domain: 'coffee-codex.us.auth0.com',
    clientId: 'coffee-codex-client-id',
    audience: 'https://api.coffee-codex.test',
    redirectUri: 'http://localhost:4200',
    logoutReturnUri: 'http://localhost:4200',
    protectedApiRoutes: [
      { uri: 'https://api.coffee-codex.test/recipes', httpMethod: 'POST' },
      { uri: 'https://api.coffee-codex.test/recipes/*', httpMethod: 'PUT' },
      { uri: 'https://api.coffee-codex.test/recipes/*', httpMethod: 'DELETE' },
      { uri: 'https://api.coffee-codex.test/recipes/*/images', httpMethod: 'POST' },
    ],
  };

  it('should add a bearer token to protected admin recipe requests', async () => {
    const auth0Client = { getTokenSilently: vi.fn().mockResolvedValue('admin-token') };
    const authState = { setAccessToken: vi.fn(), refresh: vi.fn(), setError: vi.fn() };
    const next = {
      handle: vi.fn((request: HttpRequest<unknown>) => of(new HttpResponse({ status: 200, body: request }))),
    };

    const interceptor = new AuthHttpInterceptor(
      new AuthClientConfig(buildAuthProviderConfig(authEnvironment)),
      auth0Client as never,
      authState as never,
      { isLoading$: of(false) } as never,
    );

    await firstValueFrom(interceptor.intercept(new HttpRequest('POST', `${authEnvironment.audience}/recipes`, null), next as never));

    expect(auth0Client.getTokenSilently).toHaveBeenCalledTimes(1);
    expect(authState.setAccessToken).toHaveBeenCalledWith('admin-token');
    expect(
      next.handle.mock.calls.some(
        ([request]) => (request as HttpRequest<unknown>).headers.get('Authorization') === 'Bearer admin-token',
      ),
    ).toBe(true);
  });

  it('should leave public recipe reads anonymous', async () => {
    const auth0Client = { getTokenSilently: vi.fn().mockResolvedValue('admin-token') };
    const next = {
      handle: vi.fn((request: HttpRequest<unknown>) => of(new HttpResponse({ status: 200, body: request }))),
    };

    const interceptor = new AuthHttpInterceptor(
      new AuthClientConfig(buildAuthProviderConfig(authEnvironment)),
      auth0Client as never,
      { setAccessToken: vi.fn(), refresh: vi.fn(), setError: vi.fn() } as never,
      { isLoading$: of(false) } as never,
    );

    await firstValueFrom(interceptor.intercept(new HttpRequest('GET', `${authEnvironment.audience}/recipes`), next as never));

    const publicRequest = next.handle.mock.calls[0][0] as HttpRequest<unknown>;
    expect(auth0Client.getTokenSilently).not.toHaveBeenCalled();
    expect(publicRequest.headers.has('Authorization')).toBe(false);
  });
});
