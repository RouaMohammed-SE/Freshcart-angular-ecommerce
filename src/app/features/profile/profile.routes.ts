import { Routes } from '@angular/router';
import { APP_NAME_SUFFIX } from '../../core/constants/app.constant';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then((m) => m.ProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'addresses',
        pathMatch: 'full',
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./pages/addresses/addresses.component').then((m) => m.AddressesComponent),
        title: 'Addresses' + APP_NAME_SUFFIX,
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
        title: 'Settings' + APP_NAME_SUFFIX,
      },
    ],
  },
];

