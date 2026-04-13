import { inject, Injectable } from '@angular/core';
import { IBrand } from '../models/brands/brand.model';
import { IBrandsResponse } from '../models/brands/brands-response.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IBrandResponse } from '../models/brands/brand-response.model';
import { IProductQueryParams } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getBrands(params?: IProductQueryParams): Observable<IBrandsResponse> {
    const queryParams = Object.fromEntries(
      Object.entries(params ?? {}).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number | boolean | readonly (string | number | boolean)[]>;

    return this.httpClient.get<IBrandsResponse>(`${this.baseUrl}/v1/brands`, {
      params: queryParams,
    });
  }

  getBrandById(brandId: string): Observable<IBrand> {
    return this.httpClient.get<IBrandResponse>(`${this.baseUrl}/v1/brands/${brandId}`).pipe(
      map((response: IBrandResponse) => {
        return response.data;
      }),
    );
  }
}
