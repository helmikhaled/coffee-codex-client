import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RecipeCategory } from '../../contracts/recipe-summary.dto';
import { RecipeFilterChipOption } from './recipe-filter-options';

@Component({
  selector: 'app-recipe-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="space-y-4 rounded-[1.5rem] border border-stone-200/80 bg-white/85 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:p-5"
      aria-label="Recipe filters"
    >
      <div class="space-y-2">
        <p class="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Category</p>
        <div class="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          @for (option of categoryOptions(); track option.value) {
            <button
              type="button"
              class="shrink-0 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60"
              [class.border-amber-500]="selectedCategory() === option.value"
              [class.bg-amber-500]="selectedCategory() === option.value"
              [class.text-amber-950]="selectedCategory() === option.value"
              [class.dark:border-amber-300]="selectedCategory() === option.value"
              [class.dark:bg-amber-300]="selectedCategory() === option.value"
              [class.dark:text-stone-950]="selectedCategory() === option.value"
              [class.border-stone-300]="selectedCategory() !== option.value"
              [class.bg-white]="selectedCategory() !== option.value"
              [class.text-stone-700]="selectedCategory() !== option.value"
              [class.dark:border-stone-700]="selectedCategory() !== option.value"
              [class.dark:bg-stone-950]="selectedCategory() !== option.value"
              [class.dark:text-stone-100]="selectedCategory() !== option.value"
              [attr.aria-pressed]="selectedCategory() === option.value"
              (click)="onCategoryToggle(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-[0.68rem] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">Tags</p>
        <div class="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          @for (option of tagOptions(); track option.value) {
            <button
              type="button"
              class="shrink-0 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60"
              [class.border-amber-500]="selectedTag() === option.value"
              [class.bg-amber-500]="selectedTag() === option.value"
              [class.text-amber-950]="selectedTag() === option.value"
              [class.dark:border-amber-300]="selectedTag() === option.value"
              [class.dark:bg-amber-300]="selectedTag() === option.value"
              [class.dark:text-stone-950]="selectedTag() === option.value"
              [class.border-stone-300]="selectedTag() !== option.value"
              [class.bg-white]="selectedTag() !== option.value"
              [class.text-stone-700]="selectedTag() !== option.value"
              [class.dark:border-stone-700]="selectedTag() !== option.value"
              [class.dark:bg-stone-950]="selectedTag() !== option.value"
              [class.dark:text-stone-100]="selectedTag() !== option.value"
              [attr.aria-pressed]="selectedTag() === option.value"
              (click)="onTagToggle(option.value)"
            >
              {{ option.label }}
            </button>
          }
        </div>
      </div>

      @if (hasActiveFilters()) {
        <button
          type="button"
          class="rounded-full border border-stone-300 bg-white px-5 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/60 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
          (click)="clearRequested.emit()"
        >
          Clear filters
        </button>
      }
    </section>
  `,
})
export class RecipeFilters {
  categoryOptions = input<readonly RecipeFilterChipOption<RecipeCategory>[]>([]);
  tagOptions = input<readonly RecipeFilterChipOption[]>([]);
  selectedCategory = input<RecipeCategory | null>(null);
  selectedTag = input<string | null>(null);

  categoryChanged = output<RecipeCategory | null>();
  tagChanged = output<string | null>();
  clearRequested = output<void>();

  readonly hasActiveFilters = computed(() => !!this.selectedCategory() || !!this.selectedTag());

  onCategoryToggle(category: RecipeCategory): void {
    this.categoryChanged.emit(this.selectedCategory() === category ? null : category);
  }

  onTagToggle(tag: string): void {
    this.tagChanged.emit(this.selectedTag() === tag ? null : tag);
  }
}
