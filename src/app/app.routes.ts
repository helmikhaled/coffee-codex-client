import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { RecipePagePlaceholderComponent } from './features/recipe/recipe-page-placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'r/:id',
    component: RecipePagePlaceholderComponent,
  },
];
