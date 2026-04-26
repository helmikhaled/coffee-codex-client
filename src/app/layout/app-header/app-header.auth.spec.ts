import { computed, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AppHeader } from './app-header';

@Component({
  standalone: true,
  selector: 'app-header-home-stub',
  template: '',
})
class HomeStubComponent {}

const testRoutes: Routes = [
  { path: '', component: HomeStubComponent },
  { path: 'admin/recipes', component: HomeStubComponent },
];

describe('AppHeader authentication', () => {
  let isLoading: ReturnType<typeof signal<boolean>>;
  let isAuthenticated: ReturnType<typeof signal<boolean>>;
  let authFacadeStub: {
    isLoading: ReturnType<typeof signal<boolean>>;
    isAuthenticated: ReturnType<typeof signal<boolean>>;
    canShowAdminNavigation: ReturnType<typeof computed<boolean>>;
    canStartLogin: ReturnType<typeof computed<boolean>>;
    login: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    isLoading = signal(false);
    isAuthenticated = signal(false);

    authFacadeStub = {
      isLoading,
      isAuthenticated,
      canShowAdminNavigation: computed(() => isAuthenticated()),
      canStartLogin: computed(() => !isLoading() && !isAuthenticated()),
      login: vi.fn().mockResolvedValue(true),
      logout: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [provideRouter(testRoutes), { provide: AuthFacade, useValue: authFacadeStub }],
    }).compileComponents();
  });

  it('should show sign in and hide admin actions when unauthenticated', async () => {
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(findAction(root, 'Sign In')).toBeTruthy();
    expect(findAction(root, 'Admin')).toBeUndefined();
    expect(findAction(root, 'Logout')).toBeUndefined();

    findAction(root, 'Sign In')?.click();
    expect(authFacadeStub.login).toHaveBeenCalledTimes(1);
  });

  it('should show admin navigation and logout when authenticated', async () => {
    isAuthenticated.set(true);

    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(findAction(root, 'Admin')).toBeTruthy();
    expect(findAction(root, 'Logout')).toBeTruthy();
    expect(findAction(root, 'Sign In')).toBeUndefined();

    findAction(root, 'Logout')?.click();
    expect(authFacadeStub.logout).toHaveBeenCalledTimes(1);
  });
});

function findAction(root: HTMLElement, label: string): HTMLAnchorElement | HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('a, button')).find((element) => element.textContent?.trim() === label) as
    | HTMLAnchorElement
    | HTMLButtonElement
    | undefined;
}
