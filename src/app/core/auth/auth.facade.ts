import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { hasAuthProviderConfiguration } from './auth-provider.config';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authService = inject(AuthService, { optional: true });
  private readonly router = inject(Router);
  private readonly authConfigured = hasAuthProviderConfiguration(environment.auth);

  private readonly loadingState = toSignal(this.authService?.isLoading$ ?? of(false), { initialValue: false });
  private readonly authenticatedState = toSignal(this.authService?.isAuthenticated$ ?? of(false), { initialValue: false });
  private readonly userState = toSignal<User | null | undefined>(this.authService?.user$ ?? of(null), { initialValue: null });

  readonly isConfigured = computed(() => this.authConfigured);
  readonly isLoading = computed(() => this.authConfigured && this.loadingState());
  readonly isAuthenticated = computed(() => this.authConfigured && this.authenticatedState());
  readonly user = computed(() => (this.isAuthenticated() ? this.userState() ?? null : null));
  readonly canShowAdminNavigation = computed(() => this.isAuthenticated());
  readonly canStartLogin = computed(() => this.isConfigured() && !this.isLoading() && !this.isAuthenticated());

  async login(target: string = this.router.url): Promise<boolean> {
    const authService = this.authService;

    if (!authService || !this.canStartLogin()) {
      return false;
    }

    const normalizedTarget = this.normalizeTarget(target);
    await firstValueFrom(
      authService.loginWithRedirect({
        appState: {
          target: normalizedTarget,
        },
      }),
    );
    return true;
  }

  requireAuthentication(target: string): Observable<boolean | UrlTree> {
    const authService = this.authService;

    if (!authService || !this.isConfigured()) {
      return of(this.router.parseUrl('/'));
    }

    const normalizedTarget = this.normalizeTarget(target);

    return authService.isAuthenticated$.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        }

        return authService.loginWithRedirect({
          appState: {
            target: normalizedTarget,
          },
        }).pipe(map(() => false));
      }),
    );
  }

  async logout(): Promise<boolean> {
    const authService = this.authService;

    if (!authService || !this.isConfigured()) {
      if (this.router.url.startsWith('/admin')) {
        await this.router.navigateByUrl('/');
      }
      return false;
    }

    await firstValueFrom(
      authService.logout({
        logoutParams: {
          returnTo: environment.auth.logoutReturnUri,
        },
      }),
    );
    return true;
  }

  private normalizeTarget(target: string): string {
    return target.startsWith('/') ? target : '/';
  }
}
