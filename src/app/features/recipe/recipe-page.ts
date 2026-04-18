import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RecipeBrewSpecs } from './recipe-brew-specs';
import { RecipeHeroMedia } from './recipe-hero-media';
import { RecipeIngredients } from './recipe-ingredients';
import { RecipeMetadata } from './recipe-metadata';
import { RecipePreparationSteps } from './recipe-preparation-steps';
import { RecipeDetailStore } from './recipe-detail.store';
import { formatBrewCount } from '../../shared/formatters/brew-count';

@Component({
  selector: 'app-recipe-page',
  imports: [RecipeHeroMedia, RecipeBrewSpecs, RecipeIngredients, RecipePreparationSteps, RecipeMetadata],
  providers: [RecipeDetailStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 pb-10 pt-4 sm:space-y-12 sm:pt-8">
      @if (store.isLoading() && !store.recipe()) {
        <section
          class="space-y-6 rounded-[1.75rem] border border-stone-200/80 bg-white/90 p-5 dark:border-stone-800 dark:bg-stone-900/90 sm:p-6"
          aria-live="polite"
        >
          <div class="h-3 w-24 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-10 w-3/4 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-5 w-full animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>
          <div class="h-5 w-2/3 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800"></div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="aspect-[4/5] animate-pulse rounded-2xl bg-stone-200/90 dark:bg-stone-800/80 sm:aspect-[3/2]"></div>
            <div class="space-y-3">
              <div class="h-16 animate-pulse rounded-2xl bg-stone-200/90 dark:bg-stone-800/80"></div>
              <div class="h-16 animate-pulse rounded-2xl bg-stone-200/90 dark:bg-stone-800/80"></div>
              <div class="h-16 animate-pulse rounded-2xl bg-stone-200/90 dark:bg-stone-800/80"></div>
            </div>
          </div>
        </section>
      } @else if (store.notFound()) {
        <section
          class="rounded-[1.75rem] border border-stone-200/80 bg-white/90 px-6 py-10 text-center shadow-[0_20px_50px_-34px_rgba(120,53,15,0.42)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_22px_50px_-36px_rgba(0,0,0,0.85)]"
        >
          <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Recipe Not Found</p>
          <h1 class="mt-3 font-serif text-3xl text-stone-900 dark:text-stone-50">This recipe could not be located.</h1>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">
            We could not find a recipe for <span class="font-semibold">/r/{{ id() }}</span>.
          </p>
        </section>
      } @else if (store.error(); as error) {
        <section
          class="rounded-[1.75rem] border border-stone-200/80 bg-white/90 px-6 py-10 text-center shadow-[0_20px_50px_-34px_rgba(120,53,15,0.42)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_22px_50px_-36px_rgba(0,0,0,0.85)]"
        >
          <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Unable To Continue</p>
          <h1 class="mt-3 font-serif text-3xl text-stone-900 dark:text-stone-50">Recipe details did not load.</h1>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600 dark:text-stone-300">{{ error }}</p>
          <button
            type="button"
            class="mt-6 inline-flex min-w-40 items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
            (click)="retry()"
          >
            Try Again
          </button>
        </section>
      } @else if (store.recipe(); as recipe) {
        <header class="space-y-4">
          <p class="text-[0.72rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Recipe Detail</p>
          <h1 class="max-w-4xl font-serif text-4xl leading-tight text-stone-900 dark:text-stone-50 sm:text-5xl">
            {{ recipe.title }}
          </h1>
          <p class="max-w-3xl text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">{{ recipe.description }}</p>
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <span
              class="inline-flex items-center rounded-full border border-stone-200/80 bg-white/85 px-4 py-2 text-sm font-medium tracking-[0.08em] text-stone-700 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-100"
            >
              {{ formatBrewCount(recipe.brewCount) }}
            </span>
          </div>
        </header>

        <section
          class="rounded-2xl border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:p-5"
          aria-label="Share recipe URL"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <p class="text-[0.7rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Share</p>
              <p class="text-sm text-stone-600 dark:text-stone-300">Copy a direct link to this recipe.</p>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              (click)="copyShareUrl()"
            >
              {{ isCopied() ? 'Copied' : 'Copy Link' }}
            </button>
          </div>
          @if (copyFeedback(); as copyFeedback) {
            <p class="mt-1 text-xs text-stone-600 dark:text-stone-300">{{ copyFeedback }}</p>
          }
        </section>

        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:items-start">
          <app-recipe-hero-media [images]="recipe.images" [title]="recipe.title" />

          <div class="space-y-8">
            <app-recipe-brew-specs [brewSpecs]="recipe.brewSpecs" />
            <app-recipe-metadata [author]="recipe.author" [category]="recipe.category" [tags]="recipe.tags" />
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <app-recipe-ingredients [ingredients]="recipe.ingredients" />
          <app-recipe-preparation-steps [steps]="recipe.steps" />
        </div>
      }
    </div>
  `,
})
export class RecipePage implements OnDestroy {
  id = input('');

  protected readonly store = inject(RecipeDetailStore);
  protected readonly formatBrewCount = formatBrewCount;
  protected readonly copyFeedback = signal<string | null>(null);
  protected readonly isCopied = signal(false);
  private copyStateResetHandle: ReturnType<typeof setTimeout> | null = null;
  protected readonly shareUrl = computed(() => {
    const recipeId = this.store.recipe()?.id || this.id().trim();
    if (!recipeId) {
      return '';
    }

    const path = `/r/${encodeURIComponent(recipeId)}`;
    if (typeof window === 'undefined' || !window.location?.origin) {
      return path;
    }

    return `${window.location.origin}${path}`;
  });

  constructor() {
    effect(() => {
      const recipeId = this.id().trim();
      if (!recipeId) {
        return;
      }

      untracked(() => {
        void this.store.load(recipeId);
      });
    });
  }

  protected async retry(): Promise<void> {
    await this.store.retry();
  }

  ngOnDestroy(): void {
    this.clearCopiedStateReset();
  }

  protected async copyShareUrl(): Promise<void> {
    this.clearCopiedStateReset();
    this.copyFeedback.set(null);
    this.isCopied.set(false);

    const url = this.shareUrl();
    if (!url) {
      this.copyFeedback.set('Share link is not ready yet.');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        this.isCopied.set(true);
        this.scheduleCopiedStateReset();
      } catch {
        this.copyFeedback.set('Could not copy automatically. Please copy it from the address bar.');
      }

      return;
    }

    this.copyFeedback.set('Clipboard copy is unavailable in this browser. Please copy it from the address bar.');
  }

  private clearCopiedStateReset(): void {
    if (this.copyStateResetHandle === null) {
      return;
    }

    clearTimeout(this.copyStateResetHandle);
    this.copyStateResetHandle = null;
  }

  private scheduleCopiedStateReset(): void {
    this.clearCopiedStateReset();
    this.copyStateResetHandle = setTimeout(() => {
      this.isCopied.set(false);
      this.copyStateResetHandle = null;
    }, 2200);
  }
}
