import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeaturesSectionComponent } from '../../shared/components/featuresSection/features-section.component';
import { SearchHeaderComponent } from './components/search-header/search-header.component';
import { FilterToolbarComponent } from './components/filter-toolbar/filter-toolbar.component';
import { ProductService } from '../../core/services/product.service';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { EmptyProductsSearchComponent } from './components/empty-products-search/empty-products-search.component';
import { IProduct } from '../../core/models/products/product.model';
import { ActiveFiltersComponent } from '../../shared/components/activeFilters/active-filters.component';
import { ItemsLoaderComponent } from '../../shared/components/itemsLoader/items-loader.component';
import { IMetadata } from '../../core/models/products/products-response.model';
import { FiltersMap } from '../../shared/types/filters/filters-map.type';
import { getArrayFilterIds, isArrayFilterKey } from '../../shared/utils/filters/filters-utils';
import { FilterKey } from '../../shared/types/filters/filter-key.type';
import { ArrayFilters } from '../../shared/types/filters/array-filters.type';
import { ICategory } from '../../core/models/categories/category.model';
import { IBrand } from '../../core/models/brands/brand.model';
import { CategoryService } from '../../core/services/category.service';
import { BrandService } from '../../core/services/brand.service';
import { ArrayFilterKey } from '../../shared/types/filters/array-filter-key.type';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { FilterProductsGridComponent } from './components/filter-products-grid/filter-products-grid.component';

@Component({
  selector: 'app-search',
  imports: [
    FormsModule,
    FeaturesSectionComponent,
    SearchHeaderComponent,
    FilterToolbarComponent,
    FilterSidebarComponent,
    EmptyProductsSearchComponent,
    ActiveFiltersComponent,
    ItemsLoaderComponent,
    PaginationComponent,
    FilterProductsGridComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  searchQuery = signal('');
  isSearchingProducts = signal(false);
  allProducts = signal<IProduct[]>([]);
  products = signal<IProduct[]>([]);
  productsQuantity = signal(0);
  filters = signal<FiltersMap>({});
  categories = signal<ICategory[]>([]);
  brands = signal<IBrand[]>([]);
  isReady = signal(false);
  isListView = signal(false);
  toggleMobileFilters = signal(false);
  paginationData = signal<IMetadata | null>(null);
  pagesCount = computed(() => Number(this.paginationData()?.numberOfPages) || 1);

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.searchQuery.set(params['q'] ?? '');

      if (this.isReady()) {
        this.getCurrentFilters();
        this.applyFiltersAndPagination();
      }
    });

    effect(() => {
      if (this.isReady()) {
        this.setFilter();
      }
    });
  }

  ngOnInit(): void {
    this.isSearchingProducts.set(true);

    forkJoin({
      categories: this.loadCategories(),
      brandsResponse: this.loadBrands(),
      products: this.loadAllProducts(),
    }).subscribe({
      next: ({ categories, brandsResponse, products }) => {
        this.categories.set(categories);
        this.brands.set(brandsResponse.data);
        this.allProducts.set(products);
        this.getCurrentFilters();
        this.isReady.set(true);
        this.applyFiltersAndPagination();
        this.isSearchingProducts.set(false);
      },
      error: () => {
        this.isSearchingProducts.set(false);
      },
    });
  }

  getCurrentFilters(): void {
    const params = this.route.snapshot.queryParamMap;
    const minPrice = Number(params.get('price[gte]') ?? 0);
    const maxPrice = Number(params.get('price[lte]') ?? 0);

    const data: FiltersMap = {
      q: params.get('q') ?? '',
      price: {
        minPrice: Number.isFinite(minPrice) ? minPrice : 0,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : 0,
      },
    };

    const arrayfiltersMap: ArrayFilters = {
      brand: this.brands(),
      category: this.categories(),
    };

    const filterKeys = Object.keys(arrayfiltersMap) as ArrayFilterKey[];

    filterKeys.forEach((filterKey) => {
      if (isArrayFilterKey(filterKey)) {
        const ids = params.getAll(filterKey);
        data[filterKey] = arrayfiltersMap[filterKey]!.filter((item) => ids.includes(item._id));
      }
    });

    this.filters.set(data);
  }

  setFilter(): void {
    const filters = this.filters();
    const currentQuery = this.searchQuery();
    const price = filters.price;
    const minPrice = price?.minPrice ?? 0;
    const maxPrice = price?.maxPrice ?? 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.getArraysFiltersParams(filters),
        q: currentQuery.trim() || null,
        'price[gte]': minPrice > 0 ? minPrice : null,
        'price[lte]': maxPrice > 0 ? maxPrice : null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  getArraysFiltersParams(filtersMap: FiltersMap): Record<string, string[]> {
    const filterKeys = Object.keys(filtersMap) as FilterKey[];
    const arrayFiltersIds: Record<string, string[]> = {
      category: [],
      brand: [],
    };

    filterKeys.forEach((key) => {
      if (isArrayFilterKey(key)) {
        arrayFiltersIds[key] = getArrayFilterIds(this.filters(), key) ?? [];
      }
    });

    return arrayFiltersIds;
  }

  loadProducts(): void {
    this.applyFiltersAndPagination();
  }

  loadCategories() {
    return this.categoryService.getCategories();
  }

  loadBrands() {
    return this.brandService.getBrands({});
  }

  loadAllProducts() {
    return this.productService.getAllProducts();
  }

  clearAllFilters(): void {
    this.router.navigate(['/search']);
    this.filters.set({});
    this.searchQuery.set('');
  }

  private applyFiltersAndPagination(): void {
    const filters = this.filters();
    const queryParams = this.route.snapshot.queryParamMap;
    const requestedPage = Math.max(Number(queryParams.get('page') ?? 1), 1);
    const limit = 12;

    const filteredProducts = this.sortProducts(
      this.filterProducts(this.allProducts(), filters),
      queryParams.get('sort') ?? '',
    );

    const totalResults = filteredProducts.length;
    const numberOfPages = Math.max(Math.ceil(totalResults / limit), 1);
    const currentPage = Math.min(requestedPage, numberOfPages);
    const startIndex = (currentPage - 1) * limit;

    this.products.set(filteredProducts.slice(startIndex, startIndex + limit));
    this.productsQuantity.set(totalResults);
    this.paginationData.set({
      currentPage,
      numberOfPages,
      limit,
      nextPage: currentPage < numberOfPages ? currentPage + 1 : undefined,
      prevPage: currentPage > 1 ? currentPage - 1 : undefined,
    });
  }

  private filterProducts(products: IProduct[], filters: FiltersMap): IProduct[] {
    const normalizedQuery = (filters.q ?? '').trim().toLowerCase();
    const selectedCategoryIds = new Set((filters.category ?? []).map((category) => category._id));
    const selectedBrandIds = new Set((filters.brand ?? []).map((brand) => brand._id));
    const minPrice = filters.price?.minPrice ?? 0;
    const maxPrice = filters.price?.maxPrice ?? 0;

    return products.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.slug,
        product.category?.name,
        product.brand?.name,
        ...(product.subcategory ?? []).map((subcategory) => subcategory.name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const productPrice = product.priceAfterDiscount ?? product.price;
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory =
        selectedCategoryIds.size === 0 || selectedCategoryIds.has(product.category?._id);
      const matchesBrand = selectedBrandIds.size === 0 || selectedBrandIds.has(product.brand?._id);
      const matchesMinPrice = minPrice <= 0 || productPrice >= minPrice;
      const matchesMaxPrice = maxPrice <= 0 || productPrice <= maxPrice;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesBrand &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }

  private sortProducts(products: IProduct[], sortOption: string): IProduct[] {
    const sortedProducts = [...products];

    switch (sortOption) {
      case 'price':
        return sortedProducts.sort(
          (a, b) => (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price),
        );
      case '-price':
        return sortedProducts.sort(
          (a, b) => (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price),
        );
      case '-ratingsAverage':
        return sortedProducts.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
      case 'title':
        return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      case '-title':
        return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sortedProducts;
    }
  }
}
