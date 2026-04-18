import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecipeDetailDto } from '../../contracts/recipe-detail.dto';
import { environment } from '../../../environments/environment';
import { RecipeDetailApiService } from './recipe-detail-api.service';

describe('RecipeDetailApiService', () => {
  let service: RecipeDetailApiService;
  let httpController: HttpTestingController;
  const recipesEndpoint = `${environment.apiBaseUrl.replace(/\/+$/, '')}/recipes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(RecipeDetailApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should request recipe detail by id using GET', () => {
    service.getRecipeById('dirty-matcha').subscribe();

    const request = httpController.expectOne(
      (req) => req.method === 'GET' && req.url === `${recipesEndpoint}/dirty-matcha`,
    );

    request.flush(createRecipeDetail('dirty-matcha'));
  });

  it('should encode route identifiers in the request URL', () => {
    let response: RecipeDetailDto | undefined;

    service.getRecipeById('dirty matcha/1').subscribe((value) => {
      response = value;
    });

    const request = httpController.expectOne(
      (req) => req.method === 'GET' && req.url === `${recipesEndpoint}/dirty%20matcha%2F1`,
    );

    request.flush(createRecipeDetail('dirty matcha/1'));

    expect(response?.id).toBe('dirty matcha/1');
  });

  it('should record a recipe view using POST', () => {
    service.recordRecipeView('dirty-matcha').subscribe();

    const request = httpController.expectOne(
      (req) => req.method === 'POST' && req.url === `${recipesEndpoint}/dirty-matcha/view`,
    );

    expect(request.request.body).toBeNull();
    request.flush(null);
  });

  it('should encode route identifiers in the recipe view request URL', () => {
    service.recordRecipeView('dirty matcha/1').subscribe();

    const request = httpController.expectOne(
      (req) => req.method === 'POST' && req.url === `${recipesEndpoint}/dirty%20matcha%2F1/view`,
    );

    request.flush(null);
  });
});

function createRecipeDetail(id: string): RecipeDetailDto {
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
  };
}
