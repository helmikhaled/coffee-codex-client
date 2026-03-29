import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RecipeSummaryDto } from '../../contracts/recipe-summary.dto';
import { RecipeCard } from './recipe-card';

@Component({
  selector: 'app-recipe-grid',
  imports: [RecipeCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
  template: `
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      @for (recipe of recipes(); track recipe.id) {
        <app-recipe-card [recipe]="recipe" [recipeLink]="linkRecipes() ? ['/r', recipe.id] : null" />
      }
    </div>
  `,
})
export class RecipeGrid {
  recipes = input.required<RecipeSummaryDto[]>();
  linkRecipes = input(false);
}
