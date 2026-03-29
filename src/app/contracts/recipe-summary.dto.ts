export type RecipeCategory = 'Classic' | 'Modern' | 'Citrus' | 'Dessert' | 'Iced';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RecipeSummaryDto {
  id: string;
  slug: string;
  title: string;
  category: RecipeCategory;
  thumbnailUrl: string;
  brewCount: number;
  authorName: string;
  difficulty: DifficultyLevel;
}
