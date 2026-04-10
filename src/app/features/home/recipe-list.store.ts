import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PagedResponseDto } from '../../contracts/paged-response.dto';
import { RecipeListQueryDto } from '../../contracts/recipe-list-query.dto';
import {
  DifficultyLevel,
  RecipeCategory,
  RecipeSummaryDto,
} from '../../contracts/recipe-summary.dto';
import { RecipeListApiService } from './recipe-list-api.service';

@Injectable()
export class RecipeListStore {
  private readonly api = inject(RecipeListApiService);

  private readonly initialPageSize = 12;
  private requestVersion = 0;

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
  private readonly _selectedCategory = signal<RecipeCategory | null>(null);
  private readonly _selectedTag = signal<string | null>(null);

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
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly selectedTag = this._selectedTag.asReadonly();

  readonly hasRecipes = computed(() => this._recipes().length > 0);
  readonly isEmpty = computed(
    () =>
      this._hasLoaded() &&
      !this._isInitialLoading() &&
      !this._initialError() &&
      this._recipes().length === 0,
  );
  readonly hasActiveFilters = computed(() => !!this._selectedCategory() || !!this._selectedTag());
  readonly hasMore = computed(() => {
    if (!this._hasLoaded()) {
      return false;
    }

    const currentPage = this.normalizeNumber(this._page(), 0);
    const totalPages = this.normalizeNumber(this._totalPages(), 0);
    const pageSize = this.normalizeNumber(this._pageSize(), this.initialPageSize);
    const totalCount = this.normalizeNumber(this._totalCount(), this._recipes().length);

    if (totalPages > 0 && currentPage < totalPages) {
      return true;
    }

    if (currentPage > 0 && totalCount > currentPage * pageSize) {
      return true;
    }

    return false;
  });

  async loadInitial(force = false): Promise<void> {
    if (this._isInitialLoading() && !force) {
      return;
    }

    const requestVersion = ++this.requestVersion;
    this._isInitialLoading.set(true);
    this._initialError.set(null);
    this._loadMoreError.set(null);

    try {
      const response = await firstValueFrom(
        this.api.getFirstPage(this._pageSize(), this.activeFilters()),
      );
      if (requestVersion !== this.requestVersion) {
        return;
      }

      this.applyResponse(response, false);
    } catch {
      if (requestVersion !== this.requestVersion) {
        return;
      }

      this._initialError.set('Unable to load recipes right now.');
      this._hasLoaded.set(true);
    } finally {
      if (requestVersion === this.requestVersion) {
        this._isInitialLoading.set(false);
      }
    }
  }

  async loadNextPage(): Promise<void> {
    if (this._isInitialLoading() || this._isLoadingMore() || !this.hasMore()) {
      return;
    }

    this._isLoadingMore.set(true);
    this._loadMoreError.set(null);
    const requestVersion = this.requestVersion;

    try {
      const response = await firstValueFrom(
        this.api.getNextPage(this._page(), this._pageSize(), this.activeFilters()),
      );
      if (requestVersion !== this.requestVersion) {
        return;
      }

      this.applyResponse(response, true);
    } catch {
      if (requestVersion !== this.requestVersion) {
        return;
      }

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

  async applyCategoryFilter(category: RecipeCategory | null): Promise<void> {
    if (!this.setFilters(category, this._selectedTag())) {
      return;
    }

    await this.reloadForFilterChange();
  }

  async applyTagFilter(tag: string | null): Promise<void> {
    if (!this.setFilters(this._selectedCategory(), this.normalizeTag(tag))) {
      return;
    }

    await this.reloadForFilterChange();
  }

  async clearFilters(): Promise<void> {
    if (!this.setFilters(null, null)) {
      return;
    }

    await this.reloadForFilterChange();
  }

  async syncFilters(category: RecipeCategory | null, tag: string | null): Promise<void> {
    if (!this.setFilters(category, this.normalizeTag(tag))) {
      return;
    }

    if (!this._hasLoaded() && !this._isInitialLoading()) {
      return;
    }

    await this.reloadForFilterChange();
  }

  private applyResponse(response: PagedResponseDto<RecipeSummaryDto>, append: boolean): void {
    const normalizedItems = Array.isArray(response.items)
      ? response.items.map((item) => this.normalizeRecipe(item))
      : [];
    const page = this.normalizeNumber(response.page, 1);
    const pageSize = this.normalizeNumber(response.pageSize, this._pageSize());
    const totalCount = this.normalizeNumber(response.totalCount, normalizedItems.length);
    const totalPages = this.normalizeNumber(response.totalPages, 1);

    this._recipes.set(append ? [...this._recipes(), ...normalizedItems] : normalizedItems);
    this._page.set(page);
    this._pageSize.set(pageSize);
    this._totalCount.set(totalCount);
    this._totalPages.set(totalPages);
    this._hasLoaded.set(true);
  }

  private async reloadForFilterChange(): Promise<void> {
    this.resetListingStateForNewQuery();
    await this.loadInitial(true);
  }

  private resetListingStateForNewQuery(): void {
    this._recipes.set([]);
    this._page.set(0);
    this._totalCount.set(0);
    this._totalPages.set(0);
    this._hasLoaded.set(false);
    this._loadMoreError.set(null);
  }

  private setFilters(category: RecipeCategory | null, tag: string | null): boolean {
    const normalizedCategory = this.normalizeFilterCategory(category);
    const normalizedTag = this.normalizeTag(tag);

    if (this._selectedCategory() === normalizedCategory && this._selectedTag() === normalizedTag) {
      return false;
    }

    this._selectedCategory.set(normalizedCategory);
    this._selectedTag.set(normalizedTag);
    return true;
  }

  private activeFilters(): Pick<RecipeListQueryDto, 'category' | 'tag'> {
    return {
      category: this._selectedCategory() ?? undefined,
      tag: this._selectedTag() ?? undefined,
    };
  }

  private normalizeFilterCategory(
    category: RecipeCategory | null | undefined,
  ): RecipeCategory | null {
    if (!category) {
      return null;
    }

    return this.normalizeCategory(category);
  }

  private normalizeTag(tag: string | null | undefined): string | null {
    const normalized = tag?.trim();
    return normalized ? normalized : null;
  }

  private normalizeNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
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
