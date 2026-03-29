import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { DifficultyLevel, RecipeCategory, RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { RecipeListApiService } from './recipe-list-api.service';

@Injectable()
export class RecipeListStore {
  private readonly api = inject(RecipeListApiService);

  private readonly initialPageSize = 12;

  private readonly _recipes = signal<RecipeSummaryDto[]>([]);
  private readonly _page = signal(0);
  private readonly _pageSize = signal(this.initialPageSize);
  private readonly _totalCount = signal(0);
  private readonly _totalPages = signal(0);
  private readonly _hasLoaded = signal(false);
  private readonly _isInitialLoading = signal(false);
  private readonly _isLoadingMore = signal(false);
  private readonly _initialError = signal<string | null>(null);
  private readonly _loadMoreError = signal<string | null>(null);

  readonly recipes = this._recipes.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly hasLoaded = this._hasLoaded.asReadonly();
  readonly isInitialLoading = this._isInitialLoading.asReadonly();
  readonly isLoadingMore = this._isLoadingMore.asReadonly();
  readonly initialError = this._initialError.asReadonly();
  readonly loadMoreError = this._loadMoreError.asReadonly();

  readonly hasRecipes = computed(() => this._recipes().length > 0);
  readonly isEmpty = computed(
    () => this._hasLoaded() && !this._isInitialLoading() && !this._initialError() && this._recipes().length === 0,
  );
  readonly hasMore = computed(() => {
    if (!this._hasLoaded()) {
      return false;
    }

    return this._page() < this._totalPages();
  });

  async loadInitial(): Promise<void> {
    if (this._isInitialLoading()) {
      return;
    }

    this._isInitialLoading.set(true);
    this._initialError.set(null);
    this._loadMoreError.set(null);

    try {
      const response = await firstValueFrom(this.api.getFirstPage(this._pageSize()));
      this.applyResponse(response, false);
    } catch {
      this._initialError.set('Unable to load recipes right now.');
      this._hasLoaded.set(true);
    } finally {
      this._isInitialLoading.set(false);
    }
  }

  async loadNextPage(): Promise<void> {
    if (this._isInitialLoading() || this._isLoadingMore() || !this.hasMore()) {
      return;
    }

    this._isLoadingMore.set(true);
    this._loadMoreError.set(null);

    try {
      const response = await firstValueFrom(this.api.getNextPage(this._page(), this._pageSize()));
      this.applyResponse(response, true);
    } catch {
      this._loadMoreError.set('Unable to load more recipes.');
    } finally {
      this._isLoadingMore.set(false);
    }
  }

  async retryInitial(): Promise<void> {
    await this.loadInitial();
  }

  async retryLoadMore(): Promise<void> {
    await this.loadNextPage();
  }

  private applyResponse(response: PagedResponseDto<RecipeSummaryDto>, append: boolean): void {
    const normalizedItems = Array.isArray(response.items) ? response.items.map((item) => this.normalizeRecipe(item)) : [];

    this._recipes.set(append ? [...this._recipes(), ...normalizedItems] : normalizedItems);
    this._page.set(response.page);
    this._pageSize.set(response.pageSize);
    this._totalCount.set(response.totalCount);
    this._totalPages.set(response.totalPages);
    this._hasLoaded.set(true);
  }

  private normalizeRecipe(recipe: RecipeSummaryDto): RecipeSummaryDto {
    const id = recipe.id || recipe.slug || 'recipe';
    const title = recipe.title?.trim() || 'Untitled Recipe';

    return {
      id,
      slug: recipe.slug?.trim() || id,
      title,
      category: this.normalizeCategory(recipe.category),
      thumbnailUrl: recipe.thumbnailUrl?.trim() || '',
      brewCount: Number.isFinite(recipe.brewCount) ? recipe.brewCount : 0,
      authorName: recipe.authorName?.trim() || 'Coffee Codex',
      difficulty: this.normalizeDifficulty(recipe.difficulty),
    };
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

  private normalizeDifficulty(difficulty: DifficultyLevel | string): DifficultyLevel {
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
