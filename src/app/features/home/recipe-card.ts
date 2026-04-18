import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { formatBrewCount } from '../../shared/formatters/brew-count';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
  template: `
    @if (recipeLink(); as link) {
      <a
        [routerLink]="link"
        class="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/90 shadow-[0_18px_40px_-28px_rgba(120,53,15,0.45)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_24px_48px_-26px_rgba(120,53,15,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)] dark:hover:border-stone-700"
      >
        <div class="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_54%),linear-gradient(160deg,_rgba(231,229,228,0.96),_rgba(245,245,244,0.86))] dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_54%),linear-gradient(160deg,_rgba(41,37,36,0.96),_rgba(28,25,23,0.86))]">
          @if (recipe().thumbnailUrl) {
            <img
              [src]="recipe().thumbnailUrl"
              [alt]="imageAlt()"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          } @else {
            <div class="flex h-full items-end bg-[linear-gradient(135deg,_rgba(120,53,15,0.18),_rgba(251,191,36,0.08))] p-5 dark:bg-[linear-gradient(135deg,_rgba(251,191,36,0.14),_rgba(41,37,36,0.25))]">
              <span class="max-w-[10rem] text-sm font-medium uppercase tracking-[0.22em] text-stone-600 dark:text-stone-300">
                Curated coffee recipe
              </span>
            </div>
          }

          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/30 to-transparent"></div>
        </div>

        <div class="flex flex-1 flex-col gap-4 px-4 pb-4 pt-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-2">
              <p class="text-[0.68rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {{ recipe().authorName }}
              </p>
              <h2 class="font-serif text-xl leading-tight text-stone-900 dark:text-stone-100">
                {{ recipe().title }}
              </h2>
            </div>

            <span
              class="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-amber-900 dark:border-amber-400/25 dark:bg-amber-300/10 dark:text-amber-100"
            >
              {{ recipe().difficulty }}
            </span>
          </div>

          <div class="mt-auto flex items-center justify-between gap-3 text-sm text-stone-600 dark:text-stone-300">
            <p>{{ brewCountLabel() }}</p>
            <p class="font-medium text-stone-500 dark:text-stone-400">{{ recipe().category }}</p>
          </div>
        </div>
      </a>
    } @else {
      <article
        class="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white/90 shadow-[0_18px_40px_-28px_rgba(120,53,15,0.45)] dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.75)]"
      >
        <div class="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_54%),linear-gradient(160deg,_rgba(231,229,228,0.96),_rgba(245,245,244,0.86))] dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_54%),linear-gradient(160deg,_rgba(41,37,36,0.96),_rgba(28,25,23,0.86))]">
          @if (recipe().thumbnailUrl) {
            <img
              [src]="recipe().thumbnailUrl"
              [alt]="imageAlt()"
              class="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          } @else {
            <div class="flex h-full items-end bg-[linear-gradient(135deg,_rgba(120,53,15,0.18),_rgba(251,191,36,0.08))] p-5 dark:bg-[linear-gradient(135deg,_rgba(251,191,36,0.14),_rgba(41,37,36,0.25))]">
              <span class="max-w-[10rem] text-sm font-medium uppercase tracking-[0.22em] text-stone-600 dark:text-stone-300">
                Curated coffee recipe
              </span>
            </div>
          }

          <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/30 to-transparent"></div>
        </div>

        <div class="flex flex-1 flex-col gap-4 px-4 pb-4 pt-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-2">
              <p class="text-[0.68rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {{ recipe().authorName }}
              </p>
              <h2 class="font-serif text-xl leading-tight text-stone-900 dark:text-stone-100">
                {{ recipe().title }}
              </h2>
            </div>

            <span
              class="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-amber-900 dark:border-amber-400/25 dark:bg-amber-300/10 dark:text-amber-100"
            >
              {{ recipe().difficulty }}
            </span>
          </div>

          <div class="mt-auto flex items-center justify-between gap-3 text-sm text-stone-600 dark:text-stone-300">
            <p>{{ brewCountLabel() }}</p>
            <p class="font-medium text-stone-500 dark:text-stone-400">{{ recipe().category }}</p>
          </div>
        </div>
      </article>
    }
  `,
})
export class RecipeCard {
  recipe = input.required<RecipeSummaryDto>();
  recipeLink = input<string | readonly (string | number)[] | null>(null);

  protected readonly brewCountLabel = computed(() => {
    return formatBrewCount(this.recipe().brewCount);
  });

  protected readonly imageAlt = computed(() => `${this.recipe().title} thumbnail`);
}
