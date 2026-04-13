# FreshCart Angular 21 E-Commerce

FreshCart is a standalone Angular 21 e-commerce storefront that consumes the Route E-Commerce API to deliver a complete shopping flow: authentication, product discovery, category and brand browsing, wishlist management, cart management, checkout, order history, profile settings, and bilingual UI support.

The application uses Angular SSR with hydration, lazy-loaded feature routes, Angular signals for UI state, and a service-driven data layer built on `HttpClient`. It is structured as a portfolio-ready storefront rather than a design-system demo, with real API integration and production build support.

## Features

- Standalone Angular 21 architecture with lazy-loaded feature routes
- Server-side rendering with hydration and event replay
- Authentication flow with signup, login, logout, and forgot-password reset steps
- Product catalog with pagination, filters, and product detail pages
- Category and brand browsing
- Search page with client-side filtering, sorting, and pagination
- Wishlist and cart flows for authenticated users
- Guest cart and guest wishlist persistence using `localStorage`
- Checkout flow with cash order support and hosted checkout session redirect
- Profile area with address management and account/password update forms
- Order history page for authenticated users
- Arabic and English translations via `ngx-translate`
- UI feedback with `ngx-toastr` and SweetAlert2 dialogs
- Swiper-powered product carousel sections
- Tailwind CSS v4 styling

## Tech Stack

- Angular `21.2.x`
- TypeScript `5.9.x`
- Angular SSR
- RxJS
- Angular Signals
- Tailwind CSS `4`
- `@ngx-translate/core`
- `ngx-toastr`
- `@sweetalert2/ngx-sweetalert2`
- `swiper`
- `ngx-cookie-service`
- Express `5`

## What The App Does

This project is an online grocery-style storefront branded as FreshCart. Users can:

- browse featured products, categories, and brands
- search and filter products by query, price, category, and brand
- open product detail pages and review product ratings/reviews
- create an account or log in
- add products to a cart or wishlist
- complete checkout with saved shipping addresses
- review previous orders
- manage profile data, password, and addresses
- switch between English and Arabic

## Architecture

- **Standalone app**: the app uses standalone components and `bootstrapApplication()` rather than NgModules.
- **Routing**: all major sections are lazy-loaded through route definition files.
- **SSR setup**: Angular SSR is configured through `src/server.ts`, `src/main.server.ts`, `src/app/app.config.server.ts`, and `src/app/app.routes.server.ts`.
- **State management**: there is no NgRx or external store. The project uses Angular signals and a small number of RxJS streams/subjects for local feature state.
- **Data layer**: components call services in `src/app/core/services`, which in turn call the Route API using `HttpClient`.
- **Auth/session handling**: JWT tokens are stored in cookies, and current user data is mirrored into local storage for client state restoration.

## Routing Overview

Main application routes from `src/app/app.routes.ts`:

- `/home`
- `/login`
- `/signup`
- `/forget-password`
- `/categories`
- `/categories/:id`
- `/products`
- `/products/:id`
- `/brands`
- `/search`
- `/wishlist`
- `/cart`
- `/checkout`
- `/orders`
- `/profile`
- `/profile/addresses`
- `/profile/settings`
- `/contact`

Route guards:

- `guestGuard` blocks logged-in users from auth pages
- `authGuard` protects checkout, orders, and profile routes

## Data Flow

The app follows a straightforward Angular feature flow:

1. Feature components read route params/query params.
2. Components call injected services from `src/app/core/services`.
3. Services call the Route API using `HttpClient`.
4. Responses are mapped into typed models from `src/app/core/models`.
5. Components store UI state with signals and render it in standalone templates.

Examples:

- `ProductService` loads products and product details
- `CategoryService`, `BrandService`, and `SubCategoryService` support catalog navigation
- `CartService` manages both server cart operations and guest cart persistence
- `WishlistService` manages both server wishlist operations and guest wishlist persistence
- `AuthService` handles signup, signin, token access, password reset, and current-user state
- `OrderService` creates cash orders, checkout sessions, and fetches user orders

## External API / Integrations

- Base API URL from `src/environments/environment.ts` and `src/environments/environment.development.ts`:
  - `https://ecommerce.routemisr.com/api`
- Translation files:
  - `public/i18n/en.json`
  - `public/i18n/ar.json`
- Third-party UI/runtime integrations:
  - `ngx-toastr`
  - `SweetAlert2`
  - `Swiper`
  - `ngx-cookie-service`

## Project Structure

```text
src/
  app/
    core/
      constants/        # shared constants and validators
      guards/           # auth and guest route guards
      interceptors/     # auth token interceptor
      models/           # API response and domain models
      services/         # API and storage services
    features/
      auth/             # login, signup, forgot-password
      home/             # landing page sections
      products/         # product listing page
      productDetails/   # product details and reviews
      categories/       # categories list
      categoryDetails/  # subcategories by category
      brands/           # brands list
      search/           # client-side search/filter experience
      cart/             # cart page and cart item cards
      wishlist/         # wishlist page
      checkout/         # checkout flow
      orders/           # orders history
      profile/          # profile shell, addresses, settings
      contact/          # contact page
      notFound/         # fallback route
    shared/
      components/       # reusable UI components
      types/            # shared filter types
      utils/            # helper utilities
    app.config*.ts      # app/browser/server provider setup
    app.routes*.ts      # browser/server routes
  environments/         # environment configuration
  main.ts               # browser bootstrap
  main.server.ts        # SSR bootstrap
  server.ts             # Express SSR server
public/
  i18n/                 # translation JSON files
  images/               # static images
  icons/                # SVG sprite assets
```

## Installation

### Prerequisites

- Node.js 20+ recommended for Angular 21
- npm 11+ recommended

### Steps

```bash
npm install
```

## Running The Project

### Development server

```bash
npm start
```

The app runs with Angular dev server on the default local port used by Angular CLI.

### Production build

```bash
npm run build
```

### Run the built SSR server

```bash
npm run serve:ssr:e-commerce
```

This serves the generated SSR output from `dist/e-commerce/server/server.mjs`.

## Build Instructions

Development watch build:

```bash
npm run watch
```

Production build:

```bash
npm run build
```

Artifacts are written to:

```text
dist/e-commerce
```

## Environment Configuration

Environment files:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

Current configuration:

```ts
export const environment = {
  baseUrl: 'https://ecommerce.routemisr.com/api',
};
```

If you need to point the app to another backend, update `baseUrl` in both environment files.

## Available Scripts

From `package.json`:

- `npm start` - runs `ng serve`
- `npm run build` - creates the production browser/server build
- `npm run watch` - runs Angular build in watch mode with development configuration
- `npm test` - runs the Vitest-based Angular unit tests
- `npm run serve:ssr:e-commerce` - starts the built SSR server

## Validation Summary

The project was validated against the current workspace state on **April 13, 2026**.

Verified successfully:

- Angular production build completes successfully
- SSR output is generated into `dist/e-commerce`
- Existing Vitest suite passes
- Standalone route loading and SSR configuration are valid for Angular 21

Additional improvements applied during validation:

- restored working guest cart/wishlist persistence across the UI
- fixed malformed promo-card icon text
- replaced loose `any` typing in promo-card data with a typed interface

## Known Issues

- The automated test coverage is minimal. The project currently has one spec file covering the root app shell only.
- The search feature loads the full product catalog client-side and then filters locally. This is acceptable for small datasets, but server-side search/filtering would scale better.
- There are duplicated review UI implementations under:
  - `src/app/features/productDetails/components/product-reviews`
  - `src/app/features/productDetails/components/details-review`
  Only one path is actively used, so this should be consolidated to reduce maintenance overhead.
- `angular.json` includes a `deploy` target using `angular-cli-ghpages`, but this project is SSR-enabled. GitHub Pages is not a natural deployment target for the server-rendered build without switching to a prerender/static deployment strategy.

## Exact Fixes Recommended For Remaining Issues

- **Increase test coverage**
  - Add service tests for `AuthService`, `CartService`, `WishlistService`, and `ProductService`
  - Add component tests for checkout, login, cart, and product-details flows
- **Move search filtering to the backend**
  - Replace the current `getAllProducts()` preload on the search page with server queries that pass `q`, `price`, `brand`, `category`, `sort`, and `page` directly to the API
- **Remove duplicated review implementation**
  - Keep either `product-reviews` or `details-review`
  - Update imports/usages and delete the unused tree
- **Clarify deployment strategy**
  - If SSR is required, deploy to a Node-capable host
  - If GitHub Pages is required, switch to prerender/static hosting and remove the SSR-dependent deploy path

## Future Improvements

- Add route resolvers or smarter data prefetching for key pages
- Add skeleton/loading states consistently across all API-backed views
- Introduce error boundaries or centralized API error presentation
- Add analytics, SEO metadata, and richer Open Graph support
- Add persistent recently viewed products
- Add coupon, payment, and checkout success/cancel pages
- Add CI for build and test verification

## Notes

This README is based on the actual codebase, current routing setup, environment files, dependencies, and verified build/test behavior in this workspace.
