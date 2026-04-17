import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RecipeDetailDto } from './contracts/recipe-detail.dto';
import { environment } from '../environments/environment';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  let httpController: HttpTestingController;
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes, withComponentInputBinding())],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
    localStorage.removeItem('coffee-codex-theme');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header with logo and controls', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Coffee Codex');
    expect(compiled.querySelector('#desktop-header-search')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Toggle search"]')).toBeTruthy();
    expect(compiled.querySelector('[aria-label="Switch to dark mode"], [aria-label="Switch to light mode"]')).toBeTruthy();
  });

  it('should render recipe detail route for /r/:id', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/r/espresso-tonic');
    fixture.detectChanges();

    const request = httpController.expectOne(
      (req) => req.method === 'GET' && req.url === `${recipesEndpoint}/espresso-tonic`,
    );
    request.flush(createRecipeDetail('espresso-tonic', 'Espresso Tonic'));

    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Espresso Tonic');
  });

  it('should toggle theme class when theme button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggleButton = fixture.nativeElement.querySelector(
      '[aria-label="Switch to dark mode"], [aria-label="Switch to light mode"]',
    ) as HTMLButtonElement | null;

    expect(toggleButton).toBeTruthy();
    toggleButton?.click();
    fixture.detectChanges();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('coffee-codex-theme')).toBe('dark');
  });
});

function createRecipeDetail(id: string, title: string): RecipeDetailDto {
  return {
    id,
    title,
    description: 'Citrus-forward espresso drink.',
    category: 'Citrus',
    brewCount: 800,
    author: {
      id: 'author-1',
      name: 'Coffee Codex',
      avatarUrl: 'https://images.example.com/authors/coffee-codex.jpg',
    },
    brewSpecs: {
      coffeeDoseInGrams: 18,
      coffeeYieldInGrams: 36,
      milkInMl: 0,
      cupSizeInMl: 220,
      difficulty: 'Beginner',
      timeInMinutes: 5,
    },
    ingredients: [
      { name: 'Espresso', quantityValue: 36, unit: 'g' },
      { name: 'Orange Juice', quantityValue: 120, unit: 'ml' },
    ],
    steps: [
      { order: 1, instruction: 'Pull espresso.' },
      { order: 2, instruction: 'Pour over chilled juice.' },
    ],
    images: [{ url: 'https://images.example.com/espresso-tonic.jpg', caption: 'Espresso Tonic', order: 1 }],
    tags: ['citrus', 'iced'],
  };
}
