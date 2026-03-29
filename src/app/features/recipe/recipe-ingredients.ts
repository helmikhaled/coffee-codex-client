import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IngredientDto } from '../../contracts/recipe-detail.dto';

@Component({
  selector: 'app-recipe-ingredients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="space-y-4" aria-labelledby="recipe-ingredients-heading">
      <div class="space-y-1">
        <p class="text-[0.7rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Ingredients</p>
        <h2 id="recipe-ingredients-heading" class="font-serif text-2xl text-stone-900 dark:text-stone-50 sm:text-3xl">
          What you need
        </h2>
      </div>

      @if (ingredients().length === 0) {
        <p class="rounded-2xl border border-dashed border-stone-300/90 bg-stone-100/70 px-4 py-4 text-sm text-stone-600 dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-300">
          Ingredients are not available for this recipe yet.
        </p>
      } @else {
        <ul class="space-y-2">
          @for (ingredient of ingredients(); track ingredient.name + '-' + $index) {
            <li
              class="flex items-baseline justify-between gap-3 rounded-xl border border-stone-200/80 bg-white/85 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/80"
            >
              <span class="text-sm font-medium text-stone-800 dark:text-stone-100 sm:text-base">{{ ingredient.name }}</span>
              <span class="text-sm text-stone-600 dark:text-stone-300">
                {{ formatQuantity(ingredient.quantityValue) }}{{ ingredient.unit ? ' ' + ingredient.unit : '' }}
              </span>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class RecipeIngredients {
  ingredients = input<IngredientDto[]>([]);

  protected formatQuantity(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
