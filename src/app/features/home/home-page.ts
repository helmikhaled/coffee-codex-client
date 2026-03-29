import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RecipeGrid } from './recipe-grid';
import { RecipeListStore } from './recipe-list.store';

@Component({
  selector: 'app-home-page',
  imports: [RecipeGrid],
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
            Every card leads directly into the brewing instructions. Filtering, search, and random discovery will layer on
            top of this foundation in later specs.
          </p>
        </div>

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
            <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">No Recipes Yet</p>
            <h3 class="mt-3 font-serif text-3xl text-stone-900 dark:text-stone-50">The library is currently empty.</h3>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
              Once the curator publishes recipes, they will appear here in their intended browsing order.
            </p>
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
  protected readonly store = inject(RecipeListStore);
  protected readonly skeletonCards = [1, 2, 3, 4, 5, 6];
  protected readonly recipeCountSummary = computed(() => {
    if (this.store.isInitialLoading() && !this.store.hasRecipes()) {
      return 'Brewing selection';
    }

    if (this.store.totalCount() > 0) {
      return `${this.store.recipes().length} of ${this.store.totalCount()} loaded`;
    }

    return 'Curator-built collection';
  });

  async ngOnInit(): Promise<void> {
    await this.store.loadInitial();
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
}
