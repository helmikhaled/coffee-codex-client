import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DifficultyLevel, RecipeCategory } from '../../contracts/recipe-summary.dto';
import { AuthorDto, BrewSpecsDto, ImageDto, IngredientDto, RecipeDetailDto, StepDto } from '../../contracts/recipe-detail.dto';
import { RecipeDetailApiService } from './recipe-detail-api.service';

@Injectable()
export class RecipeDetailStore {
  private readonly api = inject(RecipeDetailApiService);

  private readonly _recipe = signal<RecipeDetailDto | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _hasLoaded = signal(false);
  private readonly _notFound = signal(false);
  private readonly _lastRequestedId = signal<string | null>(null);

  readonly recipe = this._recipe.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasLoaded = this._hasLoaded.asReadonly();
  readonly notFound = this._notFound.asReadonly();
  readonly canRetry = computed(() => !!this._lastRequestedId());

  async load(id: string): Promise<void> {
    const normalizedId = id?.trim();

    if (!normalizedId) {
      this._recipe.set(null);
      this._error.set('Recipe identifier is missing.');
      this._notFound.set(false);
      this._hasLoaded.set(true);
      return;
    }

    if (this._isLoading() && this._lastRequestedId() === normalizedId) {
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);
    this._notFound.set(false);
    this._lastRequestedId.set(normalizedId);

    try {
      const response = await firstValueFrom(this.api.getRecipeById(normalizedId));
      this._recipe.set(this.normalizeRecipe(response));
      this._hasLoaded.set(true);
    } catch (error) {
      this._recipe.set(null);
      this._hasLoaded.set(true);

      if (error instanceof HttpErrorResponse && error.status === 404) {
        this._notFound.set(true);
        this._error.set(null);
      } else {
        this._notFound.set(false);
        this._error.set('Unable to load this recipe right now.');
      }
    } finally {
      this._isLoading.set(false);
    }
  }

  async retry(): Promise<void> {
    const id = this._lastRequestedId();
    if (!id) {
      return;
    }

    await this.load(id);
  }

  private normalizeRecipe(recipe: RecipeDetailDto): RecipeDetailDto {
    const title = recipe.title?.trim() || 'Untitled Recipe';

    return {
      id: recipe.id?.trim() || 'recipe',
      title,
      description: recipe.description?.trim() || 'No description available.',
      category: this.normalizeCategory(recipe.category),
      brewCount: Number.isFinite(recipe.brewCount) ? recipe.brewCount : 0,
      author: this.normalizeAuthor(recipe.author),
      brewSpecs: this.normalizeBrewSpecs(recipe.brewSpecs),
      ingredients: this.normalizeIngredients(recipe.ingredients),
      steps: this.normalizeSteps(recipe.steps),
      images: this.normalizeImages(recipe.images, title),
      tags: this.normalizeTags(recipe.tags),
    };
  }

  private normalizeAuthor(author: AuthorDto | null | undefined): AuthorDto {
    return {
      id: author?.id?.trim() || 'author',
      name: author?.name?.trim() || 'Coffee Codex',
      avatarUrl: author?.avatarUrl?.trim() || '',
    };
  }

  private normalizeBrewSpecs(specs: BrewSpecsDto | null | undefined): BrewSpecsDto {
    return {
      coffeeDoseInGrams: Number.isFinite(specs?.coffeeDoseInGrams) ? specs?.coffeeDoseInGrams ?? null : null,
      coffeeYieldInGrams: Number.isFinite(specs?.coffeeYieldInGrams) ? specs?.coffeeYieldInGrams ?? null : null,
      milkInMl: Number.isFinite(specs?.milkInMl) ? specs?.milkInMl ?? 0 : 0,
      cupSizeInMl: Number.isFinite(specs?.cupSizeInMl) ? specs?.cupSizeInMl ?? 0 : 0,
      difficulty: this.normalizeDifficulty(specs?.difficulty),
      timeInMinutes: Number.isFinite(specs?.timeInMinutes) ? specs?.timeInMinutes ?? 0 : 0,
    };
  }

  private normalizeIngredients(ingredients: IngredientDto[] | null | undefined): IngredientDto[] {
    if (!Array.isArray(ingredients)) {
      return [];
    }

    return ingredients.map((ingredient) => ({
      name: ingredient.name?.trim() || 'Ingredient',
      quantityValue: Number.isFinite(ingredient.quantityValue) ? ingredient.quantityValue : 0,
      unit: ingredient.unit?.trim() || '',
    }));
  }

  private normalizeSteps(steps: StepDto[] | null | undefined): StepDto[] {
    if (!Array.isArray(steps)) {
      return [];
    }

    return steps.map((step, index) => ({
      order: Number.isFinite(step.order) ? step.order : index + 1,
      instruction: step.instruction?.trim() || 'Instruction unavailable.',
    }));
  }

  private normalizeImages(images: ImageDto[] | null | undefined, title: string): ImageDto[] {
    if (!Array.isArray(images)) {
      return [];
    }

    return images.map((image, index) => ({
      url: image.url?.trim() || '',
      caption: image.caption?.trim() || `${title} image ${index + 1}`,
      order: Number.isFinite(image.order) ? image.order : index + 1,
    }));
  }

  private normalizeTags(tags: string[] | null | undefined): string[] {
    if (!Array.isArray(tags)) {
      return [];
    }

    return tags.map((tag) => tag?.trim() || '').filter((tag) => tag.length > 0);
  }

  private normalizeCategory(category: RecipeCategory | string): RecipeCategory {
    switch (category) {
      case 'Classic':
      case 'Modern':
      case 'Citrus':
      case 'Dessert':
      case 'Iced':
        return category;
      default:
        return 'Modern';
    }
  }

  private normalizeDifficulty(difficulty: DifficultyLevel | string | undefined): DifficultyLevel {
    switch (difficulty) {
      case 'Beginner':
      case 'Intermediate':
      case 'Advanced':
        return difficulty;
      default:
        return 'Beginner';
    }
  }
}
