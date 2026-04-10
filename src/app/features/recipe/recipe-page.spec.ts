import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecipeDetailDto } from '../../contracts/recipe-detail.dto';
import { environment } from '../../../environments/environment';
import { RecipePage } from './recipe-page';

describe('RecipePage', () => {
  let httpController: HttpTestingController;
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should request recipe detail when route id input is provided', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'dirty-matcha');

    fixture.detectChanges();

    const request = expectRecipeDetailRequest('dirty-matcha');
    request.flush(createRecipeDetail('dirty-matcha'));

    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent ?? '').toContain('Dirty Matcha');
  });

  it('should render images, specs, ingredients, steps, and metadata sections', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'dirty-matcha');

    fixture.detectChanges();

    expectRecipeDetailRequest('dirty-matcha').flush(createRecipeDetail('dirty-matcha'));

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(content).toContain('Brew profile');
    expect(content).toContain('What you need');
    expect(content).toContain('Steps');
    expect(content).toContain('Notes');
    expect(content).toContain('Matcha Powder');
    expect(content).toContain('Whisk matcha with hot water.');
    expect(content).toContain('Coffee Codex');

    const heroImage = (fixture.nativeElement as HTMLElement).querySelector('img[alt="Dirty Matcha Hero"]');
    expect(heroImage).toBeTruthy();
  });

  it('should render carousel pagination and navigate images from pagination dots', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'dirty-matcha');

    fixture.detectChanges();

    expectRecipeDetailRequest('dirty-matcha').flush(createRecipeDetail('dirty-matcha'));

    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const pagination = root.querySelector('[aria-label="Recipe image pagination"]');
    expect(pagination).toBeTruthy();

    const dots = Array.from(pagination?.querySelectorAll('button') ?? []) as HTMLButtonElement[];
    expect(dots.length).toBe(2);

    dots[1].click();
    fixture.detectChanges();

    const activeHeroImage = root.querySelector('img');
    expect(activeHeroImage?.getAttribute('src')).toContain('dirty-matcha-side.jpg');
  });

  it('should hide carousel controls when recipe has only one image', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'single-image');

    fixture.detectChanges();

    expectRecipeDetailRequest('single-image').flush(
      createRecipeDetail('single-image', {
        images: [{ url: 'https://images.example.com/single-image.jpg', caption: 'Single Image', order: 1 }],
      }),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('button[aria-label="Previous image"]')).toBeNull();
    expect(root.querySelector('button[aria-label="Next image"]')).toBeNull();
    expect(root.querySelector('[aria-label="Recipe image pagination"]')).toBeNull();
  });

  it('should hide coffee dose and yield fields when brew specs are null', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'matcha-latte');

    fixture.detectChanges();

    expectRecipeDetailRequest('matcha-latte').flush(
      createRecipeDetail('matcha-latte', {
        brewSpecs: {
          coffeeDoseInGrams: null,
          coffeeYieldInGrams: null,
          milkInMl: 180,
          cupSizeInMl: 320,
          difficulty: 'Beginner',
          timeInMinutes: 6,
        },
      }),
    );

    await fixture.whenStable();
    fixture.detectChanges();

    const content = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(content).not.toContain('Dose');
    expect(content).not.toContain('Yield');
    expect(content).toContain('Milk');
    expect(content).toContain('Cup Size');
  });

  it('should render error state and retry successfully', async () => {
    const fixture = TestBed.createComponent(RecipePage);
    fixture.componentRef.setInput('id', 'dirty-matcha');

    fixture.detectChanges();

    expectRecipeDetailRequest('dirty-matcha').flush('Server error', { status: 500, statusText: 'Server Error' });

    await fixture.whenStable();
    fixture.detectChanges();

    const contentAfterError = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(contentAfterError).toContain('Recipe details did not load.');

    const retryButton = findButton(fixture.nativeElement as HTMLElement, 'Try Again');
    expect(retryButton).toBeTruthy();
    retryButton?.click();

    const retryRequest = expectRecipeDetailRequest('dirty-matcha');
    retryRequest.flush(createRecipeDetail('dirty-matcha'));

    await fixture.whenStable();
    fixture.detectChanges();

    const contentAfterRetry = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(contentAfterRetry).toContain('Dirty Matcha');
    expect(contentAfterRetry).not.toContain('Recipe details did not load.');
  });

  function expectRecipeDetailRequest(id: string) {
    const encodedId = encodeURIComponent(id);
    return httpController.expectOne((req) => req.method === 'GET' && req.url === `${recipesEndpoint}/${encodedId}`);
  }
});

function findButton(root: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes(label)) as
    | HTMLButtonElement
    | undefined;
}

function createRecipeDetail(id: string, overrides?: Partial<RecipeDetailDto>): RecipeDetailDto {
  return {
    id,
    title: 'Dirty Matcha',
    description: 'Layered espresso and matcha drink.',
    category: 'Modern',
    brewCount: 1200,
    author: {
      id: 'author-1',
      name: 'Coffee Codex',
      avatarUrl: 'https://images.example.com/authors/coffee-codex.jpg',
    },
    brewSpecs: {
      coffeeDoseInGrams: 18,
      coffeeYieldInGrams: 36,
      milkInMl: 150,
      cupSizeInMl: 300,
      difficulty: 'Beginner',
      timeInMinutes: 7,
    },
    ingredients: [
      { name: 'Matcha Powder', quantityValue: 2, unit: 'g' },
      { name: 'Milk', quantityValue: 150, unit: 'ml' },
    ],
    steps: [
      { order: 1, instruction: 'Whisk matcha with hot water.' },
      { order: 2, instruction: 'Add milk to a glass with ice.' },
      { order: 3, instruction: 'Pour espresso on top.' },
    ],
    images: [
      { url: 'https://images.example.com/dirty-matcha-hero.jpg', caption: 'Dirty Matcha Hero', order: 1 },
      { url: 'https://images.example.com/dirty-matcha-side.jpg', caption: 'Dirty Matcha Side', order: 2 },
    ],
    tags: ['matcha', 'iced'],
    ...overrides,
  };
}
