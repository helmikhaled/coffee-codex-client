import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RecipeDetailDto } from '../../contracts/recipe-detail.dto';
import { RecipeDetailApiService } from './recipe-detail-api.service';
import { RecipeDetailStore } from './recipe-detail.store';
import { vi } from 'vitest';

describe('RecipeDetailStore', () => {
  let store: RecipeDetailStore;
  let api: { getRecipeById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = {
      getRecipeById: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [RecipeDetailStore, { provide: RecipeDetailApiService, useValue: api }],
    });

    store = TestBed.inject(RecipeDetailStore);
  });

  it('should load recipe detail and update state on success', async () => {
    const recipe = createRecipeDetail('dirty-matcha');
    api.getRecipeById.mockReturnValue(of(recipe));

    await store.load('dirty-matcha');

    expect(api.getRecipeById).toHaveBeenCalledTimes(1);
    expect(api.getRecipeById).toHaveBeenCalledWith('dirty-matcha');
    expect(store.isLoading()).toBe(false);
    expect(store.hasLoaded()).toBe(true);
    expect(store.error()).toBeNull();
    expect(store.notFound()).toBe(false);
    expect(store.recipe()?.id).toBe('dirty-matcha');
    expect(store.recipe()?.title).toBe('Dirty Matcha');
  });

  it('should set an error state when request fails with non-404 status', async () => {
    api.getRecipeById.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));

    await store.load('dirty-matcha');

    expect(store.isLoading()).toBe(false);
    expect(store.hasLoaded()).toBe(true);
    expect(store.notFound()).toBe(false);
    expect(store.recipe()).toBeNull();
    expect(store.error()).toBe('Unable to load this recipe right now.');
  });

  it('should set notFound when backend returns 404', async () => {
    api.getRecipeById.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    await store.load('missing-recipe');

    expect(store.isLoading()).toBe(false);
    expect(store.hasLoaded()).toBe(true);
    expect(store.notFound()).toBe(true);
    expect(store.error()).toBeNull();
    expect(store.recipe()).toBeNull();
  });

  it('should retry with the previously requested recipe id', async () => {
    api.getRecipeById
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })))
      .mockReturnValueOnce(of(createRecipeDetail('dirty-matcha')));

    await store.load('dirty-matcha');
    await store.retry();

    expect(api.getRecipeById).toHaveBeenCalledTimes(2);
    expect(api.getRecipeById).toHaveBeenNthCalledWith(1, 'dirty-matcha');
    expect(api.getRecipeById).toHaveBeenNthCalledWith(2, 'dirty-matcha');
    expect(store.error()).toBeNull();
    expect(store.notFound()).toBe(false);
    expect(store.recipe()?.id).toBe('dirty-matcha');
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
