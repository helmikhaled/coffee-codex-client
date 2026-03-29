import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrewSpecsDto } from '../../contracts/recipe-detail.dto';

interface RecipeSpecItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-recipe-brew-specs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <section class="space-y-4" aria-labelledby="recipe-brew-specs-heading">
      <div class="space-y-1">
        <p class="text-[0.7rem] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">Brew Specifications</p>
        <h2 id="recipe-brew-specs-heading" class="font-serif text-2xl text-stone-900 dark:text-stone-50 sm:text-3xl">
          Brew profile
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        @for (spec of specItems(); track spec.label) {
          <article
            class="rounded-2xl border border-stone-200/80 bg-white/85 px-4 py-3 shadow-[0_14px_30px_-24px_rgba(120,53,15,0.4)] dark:border-stone-800 dark:bg-stone-900/80 dark:shadow-[0_14px_30px_-24px_rgba(0,0,0,0.8)]"
          >
            <p class="text-[0.66rem] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">{{ spec.label }}</p>
            <p class="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100 sm:text-lg">{{ spec.value }}</p>
          </article>
        }
      </div>
    </section>
  `,
})
export class RecipeBrewSpecs {
  brewSpecs = input.required<BrewSpecsDto>();

  readonly specItems = computed<RecipeSpecItem[]>(() => {
    const specs = this.brewSpecs();
    const items: RecipeSpecItem[] = [];

    if (specs.coffeeDoseInGrams !== null) {
      items.push({ label: 'Dose', value: `${this.formatNumber(specs.coffeeDoseInGrams)} g` });
    }

    if (specs.coffeeYieldInGrams !== null) {
      items.push({ label: 'Yield', value: `${this.formatNumber(specs.coffeeYieldInGrams)} g` });
    }

    items.push({ label: 'Milk', value: `${this.formatNumber(specs.milkInMl)} ml` });
    items.push({ label: 'Cup Size', value: `${this.formatNumber(specs.cupSizeInMl)} ml` });
    items.push({ label: 'Difficulty', value: specs.difficulty });
    items.push({ label: 'Time', value: `${this.formatNumber(specs.timeInMinutes)} min` });

    return items;
  });

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
