import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
import { IProductsResponse } from '../models/products/products-response.model';
import { IProduct } from '../models/products/product.model';
import { IProductResponse } from '../models/products/product-response.model';

type QueryParamPrimitive = string | number | boolean;
type QueryParamValue = QueryParamPrimitive | readonly QueryParamPrimitive[];
type HttpQueryParams = Record<string, QueryParamValue>;

export type IProductQueryParams = Partial<Record<string, QueryParamValue | undefined>>;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getProducts(params?: IProductQueryParams): Observable<IProductsResponse> {
    const queryParams = this.toHttpQueryParams(params);

    return this.httpClient.get<IProductsResponse>(`${this.baseUrl}/v1/products`, {
      params: queryParams,
    });
  }

  getProductById(productId: string): Observable<IProduct> {
    return this.httpClient.get<IProductResponse>(`${this.baseUrl}/v1/products/${productId}`).pipe(
      map((response: IProductResponse) => {
        return response.data;
      }),
    );
  }

  getAllProducts(limit = 100): Observable<IProduct[]> {
    return this.getProducts({ limit, page: 1 }).pipe(
      expand((response) => {
        const nextPage = response.metadata?.nextPage;
        return nextPage ? this.getProducts({ limit, page: nextPage }) : EMPTY;
      }),
      map((response) => response.data),
      reduce((allProducts, currentProducts) => [...allProducts, ...currentProducts], [] as IProduct[]),
    );
  }

  private toHttpQueryParams(params?: IProductQueryParams): HttpQueryParams | undefined {
    if (!params) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined),
    ) as HttpQueryParams;
  }
}
