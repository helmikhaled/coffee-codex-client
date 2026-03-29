import { Routes } from '@angular/router';
import { HomePage } from './features/home/home-page';
import { RecipePagePlaceholder } from './features/recipe/recipe-page-placeholder';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'r/:id',
    component: RecipePagePlaceholder,
  },
];
