import { CartService } from './../../../core/services/cart.service';
import { Component, computed, inject, input, model, signal } from '@angular/core';
import { IProduct } from '../../../core/models/products/product.model';
import { IconComponent } from '../icon/icon.component';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [IconComponent, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService: WishlistService = inject(WishlistService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);

  product = input<IProduct>();
  isAddingToCart = signal(false);
  isAddedToCart = signal(false);
  isAddedToWishlist = model.required<boolean>();
  isAddingToWishlist = signal(false);
  isLoggedIn = this.authService.isLoggedIn;
  discountPercentage = computed(() => {
    const currentPrice = Number(this.product()?.price);
    const priceAfterDiscount = Number(this.product()?.priceAfterDiscount);

    const ratio = currentPrice - priceAfterDiscount;
    const percentage = ratio / currentPrice;
    return (percentage * 100).toFixed(0);
  });


  addToWishlist(): void {
    if (!this.isLoggedIn()) {
      this.toggleWishlistAsGuest();
      return;
    }

    this.toggleWishListAsUser();
  }

  toggleWishListAsUser(): void {
    this.isAddedToWishlist() ? this.removeFromWishListAsUser() : this.addToWishlistAsUser();
  }

  addToWishlistAsUser(): void {
    const productId = this.product()?._id;
    if (!productId) return;

    this.isAddingToWishlist.set(true);
    this.wishlistService
      .addToWishlist(productId)
      .pipe(finalize(() => this.isAddingToWishlist.set(false)))
      .subscribe({
        next: (response) => {
          this.isAddedToWishlist.set(true);
          this.updateWishlistState(response.data.length);
        },
        error: (error) => {
          console.error('Error adding product to wishlist:', error);
        },
      });
  }

  removeFromWishListAsUser(): void {
    const productId = this.product()?._id;
    if (!productId) return;

    this.isAddingToWishlist.set(true);
    this.wishlistService
      .removeFromWishlist(productId)
      .pipe(finalize(() => this.isAddingToWishlist.set(false)))
      .subscribe({
        next: (response) => {
          this.isAddedToWishlist.set(false);
          this.updateWishlistState(response.data.length);
        },
      });
  }

  getStarType(star: number): 'full' | 'half' | 'empty' {
    const rating = this.product()?.ratingsAverage ?? 0;

    return rating >= star ? 'full' : rating >= star - 0.5 ? 'half' : 'empty';
  }
  updateWishlistState(quantity: number): void {
    this.wishlistService.wishlistCount.set(quantity);
  }

  addToCart(): void {
    if (!this.isLoggedIn()) {
      this.addToCartAsGuest();
      return;
    }

    this.addToCartAsUser();
  }

  addToCartAsUser() {
    const productId = this.product()?._id;
    if (!productId) return;

    this.isAddingToCart.set(true);

    this.cartService
      .addToCart(productId)
      .pipe(finalize(() => this.isAddingToCart.set(false)))
      .subscribe({
        next: (res) => {
          this.updateCartState(res.numOfCartItems);
          this.showAddedFeedback();
        },
        error: (err) => console.error(err),
      });
  }

  private toggleWishlistAsGuest(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const currentWishlist = this.wishlistService.getGuestWishlist();
    const isSaved = currentWishlist.some((product) => product._id === currentProduct._id);

    const updatedWishlist = isSaved
      ? currentWishlist.filter((product) => product._id !== currentProduct._id)
      : [...currentWishlist, currentProduct];

    this.wishlistService.setGuestWithlist(updatedWishlist);
    this.wishlistService.wishlistCount.set(updatedWishlist.length);
    this.isAddedToWishlist.set(!isSaved);
    this.toastrService.info(
      isSaved ? 'Removed from your local wishlist.' : 'Saved to your local wishlist.',
    );
  }

  private addToCartAsGuest(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const currentCart = this.cartService.getGuestCart();
    const existingProduct = currentCart.find((product) => product.productId === currentProduct._id);

    if (existingProduct) {
      existingProduct.count += 1;
    } else {
      currentCart.push({
        productId: currentProduct._id,
        count: 1,
        price: currentProduct.priceAfterDiscount ?? currentProduct.price,
        product: currentProduct,
      });
    }

    this.cartService.setGuestCart(currentCart);
    this.cartService.cartCount.set(this.cartService.getCachedCartItemsCount(currentCart));
    this.toastrService.info('Added to your local cart.');
    this.showAddedFeedback();
  }

  private updateCartState(count: number) {
    this.cartService.cartCount.set(count);
  }

  private showAddedFeedback() {
    this.isAddedToCart.set(true);

    setTimeout(() => {
      this.isAddedToCart.set(false);
    }, 2000);
  }
}
