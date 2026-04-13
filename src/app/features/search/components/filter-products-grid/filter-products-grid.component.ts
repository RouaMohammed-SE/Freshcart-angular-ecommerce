import { Component, inject, input, OnInit, signal } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductCardComponent } from '../../../../shared/components/productCard/product-card.component';
import { IProduct } from '../../../../core/models/products/product.model';

@Component({
  selector: 'app-filter-products-grid',
  imports: [ProductCardComponent],
  templateUrl: './filter-products-grid.component.html',
  styleUrl: './filter-products-grid.component.css',
})
export class FilterProductsGridComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);

  products = input<IProduct[]>();
  isListView = input();

  InWishListSet = signal<Set<string>>(new Set());
  isLoggedIn = this.authService.isLoggedIn;

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    if (!this.isLoggedIn()) {
      this.setWishlistState(this.wishlistService.getGuestWishlist());
      return;
    }

    this.loadWishListAsUser();
  }

  loadWishListAsUser(): void {
    this.wishlistService.getCurrentWishlist().subscribe({
      next: (response) => {
        this.setWishlistState(response.data);
      },
    });
  }

  setWishlistState(products: IProduct[]): void {
    const productsIds = products.map((p) => p._id);
    this.InWishListSet.set(new Set(productsIds));
  }
}
