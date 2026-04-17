import { RecipeCategory } from './recipe-summary.dto';

export interface RecipeListQueryDto {
  page: number;
  pageSize: number;
  category?: RecipeCategory;
  tag?: string;
  search?: string;
}
