import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component').then((m) => m.ProductsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('../productDetails/product-details.component').then((m) => m.ProductDetailsComponent),
  },
];

