import { Routes } from '@angular/router';
import { APP_NAME_SUFFIX } from './core/constants/app.constant';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    canActivate: [guestGuard],
    path: 'login',
    loadChildren: () =>
      import('./features/auth/login/login.routes').then((m) => m.LOGIN_ROUTES),
    title: 'Login' + APP_NAME_SUFFIX,
  },
  {
    canActivate: [guestGuard],
    path: 'signup',
    loadChildren: () =>
      import('./features/auth/signup/signup.routes').then((m) => m.SIGNUP_ROUTES),
    title: 'Signup' + APP_NAME_SUFFIX,
  },
  {
    canActivate: [guestGuard],
    path: 'forget-password',
    loadChildren: () =>
      import('./features/auth/forgot-password/forgot-password.routes').then(
        (m) => m.FORGOT_PASSWORD_ROUTES,
      ),
    title: 'Forget Password' + APP_NAME_SUFFIX,
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
    title: 'Home' + APP_NAME_SUFFIX,
  },
  {
    canActivateChild: [authGuard],
    path: 'profile',
    title: 'Profile' + APP_NAME_SUFFIX,
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
    title: 'Categories' + APP_NAME_SUFFIX,
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
    title: 'Products' + APP_NAME_SUFFIX,
  },
  {
    path: 'brands',
    loadChildren: () => import('./features/brands/brands.routes').then((m) => m.BRANDS_ROUTES),
    title: 'Brands' + APP_NAME_SUFFIX,
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.routes').then((m) => m.SEARCH_ROUTES),
    title: 'Search' + APP_NAME_SUFFIX,
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./features/wishlist/wishlist.routes').then((m) => m.WISHLIST_ROUTES),
    title: 'Wishlist' + APP_NAME_SUFFIX,
  },
  {
    //canActivate: [authGuard],
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
    title: 'Cart' + APP_NAME_SUFFIX,
  },
  {
    canActivate: [authGuard],
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
    title: 'Checkout' + APP_NAME_SUFFIX,
  },
  {
    path: 'allorders',
    redirectTo: 'orders',
    pathMatch: 'full',
  },
  {
    canActivate: [authGuard],
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
    title: 'Orders' + APP_NAME_SUFFIX,
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES),
    title: 'Contact Us' + APP_NAME_SUFFIX,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/notFound/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Fresh' + APP_NAME_SUFFIX,
  },
];
