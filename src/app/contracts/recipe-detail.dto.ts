import { DifficultyLevel, RecipeCategory } from './recipe-summary.dto';

export interface AuthorDto {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface BrewSpecsDto {
  coffeeDoseInGrams: number | null;
  coffeeYieldInGrams: number | null;
  milkInMl: number;
  cupSizeInMl: number;
  difficulty: DifficultyLevel;
  timeInMinutes: number;
}

export interface IngredientDto {
  name: string;
  quantityValue: number;
  unit: string;
}

export interface StepDto {
  order: number;
  instruction: string;
}

export interface ImageDto {
  url: string;
  caption: string;
  order: number;
}

export interface RecipeDetailDto {
  id: string;
  title: string;
  description: string;
  category: RecipeCategory;
  brewCount: number;
  author: AuthorDto;
  brewSpecs: BrewSpecsDto;
  ingredients: IngredientDto[];
  steps: StepDto[];
  images: ImageDto[];
  tags: string[];
}
