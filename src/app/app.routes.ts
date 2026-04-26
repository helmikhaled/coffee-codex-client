import { Routes } from '@angular/router';
import { adminAuthGuard, adminChildAuthGuard } from './core/auth/admin-auth.guard';
import { AdminRecipesPage } from './features/admin/admin-recipes-page';
import { AdminShell } from './features/admin/admin-shell';
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
  {
    path: 'admin',
    component: AdminShell,
    canActivate: [adminAuthGuard],
    canActivateChild: [adminChildAuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'recipes',
      },
      {
        path: 'recipes',
        component: AdminRecipesPage,
      },
    ],
  },
];
