import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IWishlistResponse } from '../models/wishlist/wishlist-response.model';
import { StorageService } from './storage.service';
import { IProduct } from '../models/products/product.model';

type IWishlistMutationResponse = Pick<IWishlistResponse, 'data'> & {
  status?: string;
  message?: string;
};

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  private readonly storageService = inject(StorageService);
  wishlistCount = signal(0);

  getCurrentWishlist(): Observable<IWishlistResponse> {
    return this.httpClient.get<IWishlistResponse>(`${this.baseUrl}/v1/wishlist`);
  }

  addToWishlist(productId: string): Observable<IWishlistMutationResponse> {
    return this.httpClient.post<IWishlistMutationResponse>(`${this.baseUrl}/v1/wishlist`, {
      productId,
    });
  }

  removeFromWishlist(productId: string): Observable<IWishlistMutationResponse> {
    return this.httpClient.delete<IWishlistMutationResponse>(
      `${this.baseUrl}/v1/wishlist/${productId}`,
    );
  }

  setGuestWithlist(products: IProduct[]): void {
    this.storageService.setItem('guestWishlist', JSON.stringify(products));
  }

  getGuestWishlist(): IProduct[] {
    const wishlist = this.storageService.getItem('guestWishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }

  setCachedWishlistQuantity() {
    const currentWishlist = this.getGuestWishlist();
    const currentQuantity = currentWishlist.length;
    this.wishlistCount.set(currentQuantity);
  }
}
