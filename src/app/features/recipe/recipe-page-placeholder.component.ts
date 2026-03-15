import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-recipe-page-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-4 py-4">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
        Recipe Detail
      </p>
      <h1 class="text-3xl font-semibold text-stone-900 dark:text-stone-100 sm:text-4xl">Recipe Placeholder</h1>
      <p class="text-sm text-stone-600 dark:text-stone-300 sm:text-base">
        Route parameter captured: <span class="font-semibold">/r/{{ id() }}</span>
      </p>
    </section>
  `,
})
export class RecipePagePlaceholderComponent {
  id = input('');
}
