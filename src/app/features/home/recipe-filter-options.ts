import { RecipeCategory } from '../../contracts/recipe-summary.dto';

export interface RecipeFilterChipOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export const RECIPE_FILTER_CATEGORY_OPTIONS: readonly RecipeFilterChipOption<RecipeCategory>[] = [
  { value: 'Classic', label: 'Classic' },
  { value: 'Modern', label: 'Modern' },
  { value: 'Citrus', label: 'Citrus' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Iced', label: 'Iced' },
];

export const RECIPE_FILTER_TAG_OPTIONS: readonly RecipeFilterChipOption[] = [
  { value: 'matcha', label: 'Matcha' },
  { value: 'citrus', label: 'Citrus' },
  { value: 'oat-milk', label: 'Oat Milk' },
  { value: 'iced', label: 'Iced' },
  { value: 'dessert', label: 'Dessert' },
];

export const RECIPE_FILTER_CATEGORY_VALUES = new Set(
  RECIPE_FILTER_CATEGORY_OPTIONS.map((option) => option.value),
);

export const RECIPE_FILTER_TAG_VALUES = new Set(
  RECIPE_FILTER_TAG_OPTIONS.map((option) => option.value),
);
