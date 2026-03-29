import { Routes } from '@angular/router';
import { HomePage } from './features/home/home-page';
import { RecipePage } from './features/recipe/recipe-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'r/:id',
    component: RecipePage,
  },
];
