import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StepDto } from '../../contracts/recipe-detail.dto';

@Component({
  selector: 'app-recipe-preparation-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="space-y-4" aria-labelledby="recipe-steps-heading">
      <div class="space-y-1">
        <p class="text-[0.7rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Preparation</p>
        <h2 id="recipe-steps-heading" class="font-serif text-2xl text-stone-900 dark:text-stone-50 sm:text-3xl">Steps</h2>
      </div>

      @if (steps().length === 0) {
        <p class="rounded-2xl border border-dashed border-stone-300/90 bg-stone-100/70 px-4 py-4 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-300">
          Preparation steps are not available for this recipe yet.
        </p>
      } @else {
        <ol class="space-y-3">
          @for (step of steps(); track step.order + '-' + $index) {
            <li class="rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-4 dark:border-stone-800 dark:bg-stone-900/85 sm:px-5">
              <div class="flex items-start gap-3 sm:gap-4">
                <span
                  class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900 dark:bg-amber-300/15 dark:text-amber-100"
                >
                  {{ step.order }}
                </span>
                <p class="text-sm leading-7 text-stone-700 dark:text-stone-200 sm:text-base">{{ step.instruction }}</p>
              </div>
            </li>
          }
        </ol>
      }
    </section>
  `,
})
export class RecipePreparationSteps {
  steps = input<StepDto[]>([]);
}
