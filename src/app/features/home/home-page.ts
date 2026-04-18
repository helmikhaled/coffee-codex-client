import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RecipeCategory } from '../../contracts/recipe-summary.dto';
import { RecipeListApiService } from './recipe-list-api.service';
import {
  RECIPE_FILTER_CATEGORY_OPTIONS,
  RECIPE_FILTER_CATEGORY_VALUES,
  RECIPE_FILTER_TAG_OPTIONS,
  RECIPE_FILTER_TAG_VALUES,
} from './recipe-filter-options';
import { RecipeFilters } from './recipe-filters';
import { RecipeGrid } from './recipe-grid';
import { RecipeListStore } from './recipe-list.store';

@Component({
  selector: 'app-home-page',
  imports: [RecipeGrid, RecipeFilters],
  providers: [RecipeListStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-14 pb-10 pt-4 sm:space-y-16 sm:pt-8">
      <section
        class="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-[linear-gradient(180deg,rgba(255,251,235,0.72),rgba(255,255,255,0.95))] px-5 py-8 shadow-[0_25px_70px_-40px_rgba(120,53,15,0.38)] dark:border-stone-800/80 dark:bg-[linear-gradient(180deg,rgba(41,37,36,0.96),rgba(17,24,39,0.9))] dark:shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)] sm:px-8 sm:py-10 lg:px-12 lg:py-14"
      >
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)] lg:items-end">
          <div class="space-y-6">
            <p class="text-[0.72rem] uppercase tracking-[0.32em] text-stone-500 dark:text-stone-400">
              Curated Recipe Library
            </p>

            <div class="space-y-4">
              <h1 class="max-w-3xl font-serif text-4xl leading-tight text-stone-900 dark:text-stone-50 sm:text-5xl lg:text-6xl">
                A quiet library of modern coffee drinks for home baristas.
              </h1>
              <p class="max-w-2xl text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
                Discover recipes in curator-defined order, with clear preparation paths and a calm, image-first browsing
                experience built for mobile.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <div
                class="rounded-full border border-stone-200/80 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-600 dark:border-stone-700/80 dark:bg-stone-900/80 dark:text-stone-300"
              >
                Curated order
              </div>
              <div
                class="rounded-full border border-stone-200/80 bg-white/85 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-600 dark:border-stone-700/80 dark:bg-stone-900/80 dark:text-stone-300"
              >
                Mobile first
              </div>
              <div
                class="rounded-full border border-amber-200/80 bg-amber-50/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-amber-900 dark:border-amber-400/25 dark:bg-amber-300/10 dark:text-amber-100"
              >
                {{ recipeCountSummary() }}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="inline-flex min-w-40 items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-50 transition hover:bg-stone-700 disabled:cursor-wait disabled:opacity-70 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
                [disabled]="isRandomLoading()"
                (click)="discoverRandomRecipe()"
              >
                {{ isRandomLoading() ? 'Finding…' : 'Surprise Me' }}
              </button>
            </div>

            @if (randomError(); as randomError) {
              <p class="text-sm leading-6 text-rose-700 dark:text-rose-300">{{ randomError }}</p>
            }
          </div>

          <aside
            class="rounded-[1.75rem] border border-white/60 bg-white/70 p-5 backdrop-blur dark:border-stone-700/70 dark:bg-stone-900/70 sm:p-6"
          >
            <p class="text-sm font-medium uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Editorial Notes</p>
            <div class="mt-5 space-y-4 text-sm leading-7 text-stone-600 dark:text-stone-300">
              <p>Recipes appear in the order chosen by the curator, not by popularity or recency.</p>
              <p>Large imagery, simple metadata, and uncluttered pacing keep the landing page closer to a coffee book than a feed.</p>
            </div>
          </aside>
        </div>
      </section>

      <section class="space-y-6" aria-labelledby="recipe-library-heading">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="space-y-2">
            <p class="text-[0.72rem] uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400">Browse</p>
            <h2 id="recipe-library-heading" class="font-serif text-3xl text-stone-900 dark:text-stone-50 sm:text-4xl">
              Recipe library
            </h2>
          </div>

          <p class="max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
            Every card leads directly into the brewing instructions. Filters and search narrow the shelf, while Surprise Me
            offers one-click discovery.
          </p>
        </div>

        <app-recipe-filters
          [categoryOptions]="categoryOptions"
          [tagOptions]="tagOptions"
          [selectedCategory]="store.selectedCategory()"
          [selectedTag]="store.selectedTag()"
          (categoryChanged)="applyCategoryFilter($event)"
          (tagChanged)="applyTagFilter($event)"
          (clearRequested)="clearFilters()"
        />

        @if (store.isInitialLoading() && !store.hasRecipes()) {
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (skeleton of skeletonCards; track skeleton) {
              <div
                class="overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/85 shadow-[0_18px_40px_-28px_rgba(120,53,15,0.45)] dark:border-stone-800 dark:bg-stone-900/85 dark:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)]"
              >
                <div class="aspect-[4/5] animate-pulse bg-stone-200/80 dark:bg-stone-800"></div>
                <div class="space-y-3 px-4 pb-4 pt-3">
                  <div class="h-3 w-24 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
                  <div class="h-6 w-3/4 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
                  <div class="h-4 w-1/2 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
                </div>
              </div>
            }
          </div>
        } @else if (store.initialError(); as initialError) {
          <div
            class="rounded-[1.75rem] border border-stone-200/80 bg-white/90 px-6 py-10 text-center shadow-[0_20px_50px_-34px_rgba(120,53,15,0.42)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_22px_50px_-36px_rgba(0,0,0,0.85)]"
          >
            <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Unable to Continue</p>
            <h3 class="mt-3 font-serif text-3xl text-stone-900 dark:text-stone-50">The recipe shelf did not load.</h3>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">{{ initialError }}</p>
            <button
              type="button"
              class="mt-6 inline-flex min-w-40 items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              (click)="retryInitial()"
            >
              Try Again
            </button>
          </div>
        } @else if (store.isEmpty()) {
          <div
            class="rounded-[1.75rem] border border-dashed border-stone-300/90 bg-stone-100/70 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/60"
          >
            <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
              {{
                store.hasActiveSearch()
                  ? 'No Recipes Found'
                  : store.hasActiveFilters()
                    ? 'No Matching Recipes'
                    : 'No Recipes Yet'
              }}
            </p>
            <h3 class="mt-3 font-serif text-3xl text-stone-900 dark:text-stone-50">
              {{
                store.hasActiveSearch()
                  ? 'No recipes found'
                  : store.hasActiveFilters()
                  ? 'No recipes matched your selected filters.'
                  : 'The library is currently empty.'
              }}
            </h3>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
              {{
                store.hasActiveSearch()
                  ? 'Try another keyword or clear search to return to the full recipe shelf.'
                  : store.hasActiveFilters()
                  ? 'Try a different category or tag to broaden the recipe shelf.'
                  : 'Once the curator publishes recipes, they will appear here in their intended browsing order.'
              }}
            </p>
            @if (store.hasActiveSearch()) {
              <button
                type="button"
                class="mt-6 inline-flex min-w-40 items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                (click)="clearSearch()"
              >
                Clear Search
              </button>
            } @else if (store.hasActiveFilters()) {
              <button
                type="button"
                class="mt-6 inline-flex min-w-40 items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                (click)="clearFilters()"
              >
                Clear Filters
              </button>
            }
          </div>
        } @else {
          <app-recipe-grid [recipes]="store.recipes()" [linkRecipes]="true" />

          @if (store.loadMoreError(); as loadMoreError) {
            <div class="flex flex-col items-center gap-3 rounded-[1.5rem] bg-stone-100/80 px-4 py-5 text-center dark:bg-stone-900/80">
              <p class="text-sm text-stone-600 dark:text-stone-300">{{ loadMoreError }}</p>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                (click)="retryLoadMore()"
              >
                Retry
              </button>
            </div>
          }

          @if (store.hasMore() || store.isLoadingMore()) {
            <div class="flex justify-center pt-2">
              <button
                type="button"
                class="inline-flex min-w-40 items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 disabled:cursor-wait disabled:opacity-70 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
                [disabled]="store.isLoadingMore()"
                (click)="loadMore()"
              >
                {{ store.isLoadingMore() ? 'Loading…' : 'Load More' }}
              </button>
            </div>
          }
        }
      </section>
    </div>
  `,
})
export class HomePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipeListApi = inject(RecipeListApiService);
  protected readonly store = inject(RecipeListStore);
  protected readonly skeletonCards = [1, 2, 3, 4, 5, 6];
  protected readonly categoryOptions = RECIPE_FILTER_CATEGORY_OPTIONS;
  protected readonly tagOptions = RECIPE_FILTER_TAG_OPTIONS;
  protected readonly isRandomLoading = signal(false);
  protected readonly randomError = signal<string | null>(null);
  protected readonly recipeCountSummary = computed(() => {
    if (this.store.isInitialLoading() && !this.store.hasRecipes()) {
      return 'Brewing selection';
    }

    if (this.store.totalCount() > 0) {
      return `${this.store.recipes().length} of ${this.store.totalCount()} loaded`;
    }

    return 'Curator-built collection';
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      void this.syncListingQueryFromRoute(queryParams);
    });
  }

  protected async loadMore(): Promise<void> {
    await this.store.loadNextPage();
  }

  protected async retryInitial(): Promise<void> {
    await this.store.retryInitial();
  }

  protected async retryLoadMore(): Promise<void> {
    await this.store.retryLoadMore();
  }

  protected async applyCategoryFilter(category: RecipeCategory | null): Promise<void> {
    await this.store.applyCategoryFilter(category);
    await this.updateListingQueryParams(
      this.store.selectedCategory(),
      this.store.selectedTag(),
      this.store.searchTerm(),
    );
  }

  protected async applyTagFilter(tag: string | null): Promise<void> {
    await this.store.applyTagFilter(tag);
    await this.updateListingQueryParams(
      this.store.selectedCategory(),
      this.store.selectedTag(),
      this.store.searchTerm(),
    );
  }

  protected async clearFilters(): Promise<void> {
    await this.store.clearFilters();
    await this.updateListingQueryParams(null, null, this.store.searchTerm());
  }

  protected async clearSearch(): Promise<void> {
    await this.store.clearSearch();
    await this.updateListingQueryParams(this.store.selectedCategory(), this.store.selectedTag(), null);
  }

  protected async discoverRandomRecipe(): Promise<void> {
    if (this.isRandomLoading()) {
      return;
    }

    this.randomError.set(null);
    this.isRandomLoading.set(true);

    try {
      const randomRecipe = await firstValueFrom(this.recipeListApi.getRandomRecipe());
      const recipeId = randomRecipe.id?.trim();
      if (!recipeId) {
        throw new Error('Random recipe response did not include a valid id.');
      }

      await this.router.navigate(['/r', recipeId]);
    } catch {
      this.randomError.set('Unable to discover a random recipe right now. Please try again.');
    } finally {
      this.isRandomLoading.set(false);
    }
  }

  private normalizeCategory(value: string | null): RecipeCategory | null {
    if (!value || !RECIPE_FILTER_CATEGORY_VALUES.has(value as RecipeCategory)) {
      return null;
    }

    return value as RecipeCategory;
  }

  private normalizeTag(value: string | null): string | null {
    const normalized = value?.trim().toLowerCase();
    if (!normalized || !RECIPE_FILTER_TAG_VALUES.has(normalized)) {
      return null;
    }

    return normalized;
  }

  private normalizeSearch(value: string | null): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
  }

  private async syncListingQueryFromRoute(queryParams: ParamMap): Promise<void> {
    const category = this.normalizeCategory(queryParams.get('category'));
    const tag = this.normalizeTag(queryParams.get('tag'));
    const search = this.normalizeSearch(queryParams.get('search'));

    await this.store.syncQuery(category, tag, search);

    if (!this.store.hasLoaded() && !this.store.isInitialLoading()) {
      await this.store.loadInitial();
    }
  }

  private async updateListingQueryParams(
    category: RecipeCategory | null,
    tag: string | null,
    search: string | null,
  ): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: category ?? null,
        tag: tag ?? null,
        search: search ?? null,
      },
    });
  }
}
