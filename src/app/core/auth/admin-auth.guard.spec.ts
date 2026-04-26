import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet, Routes } from '@angular/router';
import { of } from 'rxjs';
import { AdminRecipesPage } from '../../features/admin/admin-recipes-page';
import { AdminShell } from '../../features/admin/admin-shell';
import { AuthFacade } from './auth.facade';
import { adminAuthGuard, adminChildAuthGuard } from './admin-auth.guard';

@Component({
  standalone: true,
  selector: 'app-admin-home-stub',
  template: '',
})
class HomeStubComponent {}

@Component({
  standalone: true,
  selector: 'app-admin-host',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class HostComponent {}

describe('adminAuthGuard', () => {
  let router: Router;
  let authFacadeStub: { requireAuthentication: ReturnType<typeof vi.fn> };

  const routes: Routes = [
    { path: '', component: HomeStubComponent },
    {
      path: 'admin',
      component: AdminShell,
      canActivate: [adminAuthGuard],
      canActivateChild: [adminChildAuthGuard],
      children: [{ path: 'recipes', component: AdminRecipesPage }],
    },
  ];

  beforeEach(async () => {
    authFacadeStub = {
      requireAuthentication: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter(routes), { provide: AuthFacade, useValue: authFacadeStub }],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should allow access to admin recipes when the auth facade permits it', async () => {
    authFacadeStub.requireAuthentication.mockReturnValue(of(true));

    const fixture = TestBed.createComponent(HostComponent);
    await router.navigateByUrl('/admin/recipes');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.url).toBe('/admin/recipes');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Recipe management will appear here.');
  });

  it('should redirect away from admin routes when the auth facade denies access', async () => {
    authFacadeStub.requireAuthentication.mockReturnValue(of(router.parseUrl('/')));

    const fixture = TestBed.createComponent(HostComponent);
    await router.navigateByUrl('/admin/recipes');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authFacadeStub.requireAuthentication).toHaveBeenCalledWith('/admin/recipes');
    expect(router.url).toBe('/');
  });
});
