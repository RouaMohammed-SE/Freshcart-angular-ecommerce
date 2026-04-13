import { Routes } from '@angular/router';

export const BRANDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./brands.component').then((m) => m.BrandsComponent),
  },
];

