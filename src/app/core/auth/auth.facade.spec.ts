import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthFacade } from './auth.facade';

@Component({
  standalone: true,
  selector: 'app-auth-home-stub',
  template: '',
})
class HomeStubComponent {}

@Component({
  standalone: true,
  selector: 'app-auth-admin-stub',
  template: '',
})
class AdminStubComponent {}

describe('AuthFacade', () => {
  const originalAuth = {
    ...environment.auth,
    protectedApiRoutes: environment.auth.protectedApiRoutes.map((route) => ({ ...route })),
  };

  afterEach(() => {
    environment.auth.domain = originalAuth.domain;
    environment.auth.clientId = originalAuth.clientId;
    environment.auth.audience = originalAuth.audience;
    environment.auth.redirectUri = originalAuth.redirectUri;
    environment.auth.logoutReturnUri = originalAuth.logoutReturnUri;
    environment.auth.protectedApiRoutes = originalAuth.protectedApiRoutes.map((route) => ({ ...route }));
    TestBed.resetTestingModule();
  });

  it('should start login with the original admin target when access is protected', async () => {
    const { facade, authServiceStub } = setupFacade({ authenticated: false, configured: true });

    const result = await firstValueFrom(facade.requireAuthentication('/admin/recipes?draft=1'));

    expect(result).toBe(false);
    expect(authServiceStub.loginWithRedirect).toHaveBeenCalledWith({
      appState: {
        target: '/admin/recipes?draft=1',
      },
    });
  });

  it('should allow access without redirect when already authenticated', async () => {
    const { facade, authServiceStub } = setupFacade({ authenticated: true, configured: true });

    const result = await firstValueFrom(facade.requireAuthentication('/admin/recipes'));

    expect(result).toBe(true);
    expect(authServiceStub.loginWithRedirect).not.toHaveBeenCalled();
  });

  it('should log out to the configured public return URL', async () => {
    const { facade, authServiceStub } = setupFacade({ authenticated: true, configured: true });

    await facade.logout();

    expect(authServiceStub.logout).toHaveBeenCalledWith({
      logoutParams: {
        returnTo: environment.auth.logoutReturnUri,
      },
    });
  });

  it('should navigate back to home when logout is attempted without auth configuration on an admin route', async () => {
    const { facade, router } = setupFacade({ authenticated: false, configured: false });

    await router.navigateByUrl('/admin/recipes');
    await facade.logout();

    expect(router.url).toBe('/');
  });
});

function setupFacade(options: { authenticated: boolean; configured: boolean }): {
  facade: AuthFacade;
  router: Router;
  authServiceStub: {
    isLoading$: BehaviorSubject<boolean>;
    isAuthenticated$: BehaviorSubject<boolean>;
    user$: BehaviorSubject<null>;
    loginWithRedirect: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
} {
  environment.auth.domain = options.configured ? 'coffee-codex.us.auth0.com' : '';
  environment.auth.clientId = options.configured ? 'coffee-codex-client-id' : '';
  environment.auth.audience = 'https://api.coffee-codex.test';
  environment.auth.redirectUri = 'http://localhost:4200';
  environment.auth.logoutReturnUri = 'http://localhost:4200';
  environment.auth.protectedApiRoutes = [
    { uri: 'https://api.coffee-codex.test/recipes', httpMethod: 'POST' },
    { uri: 'https://api.coffee-codex.test/recipes/*', httpMethod: 'PUT' },
    { uri: 'https://api.coffee-codex.test/recipes/*', httpMethod: 'DELETE' },
    { uri: 'https://api.coffee-codex.test/recipes/*/images', httpMethod: 'POST' },
  ];

  const authServiceStub = {
    isLoading$: new BehaviorSubject(false),
    isAuthenticated$: new BehaviorSubject(options.authenticated),
    user$: new BehaviorSubject<null>(null),
    loginWithRedirect: vi.fn(() => of(void 0)),
    logout: vi.fn(() => of(void 0)),
  };

  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: '', component: HomeStubComponent },
        { path: 'admin/recipes', component: AdminStubComponent },
      ]),
      { provide: AuthService, useValue: authServiceStub },
    ],
  });

  return {
    facade: TestBed.inject(AuthFacade),
    router: TestBed.inject(Router),
    authServiceStub,
  };
}
