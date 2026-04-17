import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes, UrlTree } from '@angular/router';
import { AppHeader } from './app-header';

@Component({
  standalone: true,
  template: '',
})
class HomeStubComponent {}

@Component({
  standalone: true,
  template: '',
})
class RecipeStubComponent {}

const testRoutes: Routes = [
  { path: '', component: HomeStubComponent },
  { path: 'r/:id', component: RecipeStubComponent },
];

describe('AppHeader', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should submit search from the button and preserve category/tag query params', async () => {
    const fixture = TestBed.createComponent(AppHeader);

    await router.navigateByUrl('/?category=Modern&tag=matcha');
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopSearchInput = fixture.nativeElement.querySelector('#desktop-header-search') as HTMLInputElement;
    desktopSearchInput.value = 'latte';
    desktopSearchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Search')?.click();
    await fixture.whenStable();

    const urlTree = router.parseUrl(router.url);
    expect(isHomeRoute(urlTree)).toBe(true);
    expect(urlTree.queryParams['category']).toBe('Modern');
    expect(urlTree.queryParams['tag']).toBe('matcha');
    expect(urlTree.queryParams['search']).toBe('latte');
  });

  it('should submit search when Enter is pressed in the search input', async () => {
    const fixture = TestBed.createComponent(AppHeader);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopSearchInput = fixture.nativeElement.querySelector('#desktop-header-search') as HTMLInputElement;
    desktopSearchInput.value = 'cortado';
    desktopSearchInput.dispatchEvent(new Event('input'));
    desktopSearchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    fixture.detectChanges();
    await fixture.whenStable();

    const urlTree = router.parseUrl(router.url);
    expect(isHomeRoute(urlTree)).toBe(true);
    expect(urlTree.queryParams['search']).toBe('cortado');
  });

  it('should navigate to home with search query when submitting from recipe route', async () => {
    const fixture = TestBed.createComponent(AppHeader);

    await router.navigateByUrl('/r/dirty-matcha?category=Modern&tag=matcha');
    fixture.detectChanges();
    await fixture.whenStable();

    const desktopSearchInput = fixture.nativeElement.querySelector('#desktop-header-search') as HTMLInputElement;
    desktopSearchInput.value = 'espresso';
    desktopSearchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    findButton(fixture.nativeElement as HTMLElement, 'Search')?.click();
    await fixture.whenStable();

    const urlTree = router.parseUrl(router.url);
    expect(isHomeRoute(urlTree)).toBe(true);
    expect(urlTree.queryParams['category']).toBe('Modern');
    expect(urlTree.queryParams['tag']).toBe('matcha');
    expect(urlTree.queryParams['search']).toBe('espresso');
  });

  it('should clear search and keep category/tag query params', async () => {
    const fixture = TestBed.createComponent(AppHeader);

    await router.navigateByUrl('/?category=Modern&tag=matcha&search=latte');
    fixture.detectChanges();
    await fixture.whenStable();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear search"]') as HTMLButtonElement;
    clearButton.click();

    fixture.detectChanges();
    await fixture.whenStable();

    const urlTree = router.parseUrl(router.url);
    expect(isHomeRoute(urlTree)).toBe(true);
    expect(urlTree.queryParams['category']).toBe('Modern');
    expect(urlTree.queryParams['tag']).toBe('matcha');
    expect(urlTree.queryParams['search']).toBeUndefined();
  });
});

function isHomeRoute(urlTree: UrlTree): boolean {
  return (urlTree.root.children['primary']?.segments ?? []).length === 0;
}

function findButton(root: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.trim() === label) as
    | HTMLButtonElement
    | undefined;
}
