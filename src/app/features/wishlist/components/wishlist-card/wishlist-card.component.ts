import { Component, inject, input, model, output, signal } from '@angular/core';
import { IProduct } from '../../../../core/models/products/product.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { finalize } from 'rxjs';
import { ICartProductGuest } from '../../../../core/models/cart/cart-product-guest.model';
import { WishlistService } from '../../../../core/services/wishlist.service';
import Swal from 'sweetalert2';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist-card',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './wishlist-card.component.html',
  styleUrl: './wishlist-card.component.css',
})
export class WishlistCardComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly toastrService = inject(ToastrService);

  cartProducts = input<ICartProductGuest[]>();
  product = input<IProduct>();
  updateWishlist = output<string>();
  isProductInCart = model<boolean>();
  isLoggedIn = this.authService.isLoggedIn;
  isLoading = signal(false);

  addToCart() {
    if (!this.isLoggedIn()) {
      this.promptSignIn('add products to your cart');
      return;
    }

    this.addToCartAsUser();
  }

  addToCartAsUser() {
    const productId = this.product()?._id;
    if (!productId) return;
    this.isLoading.set(true);
    this.cartService
      .addToCart(productId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.updateCartState(res.numOfCartItems);
          this.isProductInCart.set(true);
        },
        error: (err) => console.error(err),
      });
  }

  private updateCartState(count: number) {
    this.cartService.cartCount.set(count);
  }

  removeFromWishlist(): void {
    this.isLoggedIn() ? this.removeFromWishlistAsUser() : this.removeFromWishlistAsGuest();
  }
  removeFromWishlistAsUser(): void {
    const product = this.product()?._id;
    if (!product) return;
    this.isLoading.set(true);
    this.wishlistService
      .removeFromWishlist(this.product()?._id!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.onUpdateWishlist();
        },
      });
  }

  removeFromWishlistAsGuest(): void {
    let currentWishlist = this.wishlistService.getGuestWishlist();
    currentWishlist = currentWishlist.filter((p) => p._id != this.product()?._id);
    this.wishlistService.setGuestWithlist(currentWishlist);
    this.onUpdateWishlist();
  }

  onUpdateWishlist() {
    this.updateWishlist.emit(this.product()?._id!);
  }

  private promptSignIn(action: string): void {
    this.toastrService.info(`Please sign in to ${action}.`);
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  showRemoveDialog() {
    Swal.fire({
      icon: 'warning',
      title: 'Remove Item?',
      text: `Remove ${this.product()?.title} from your wishlist?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Remove',

      buttonsStyling: false,

      customClass: {
        icon: 'text-xs',
        popup: 'rounded-2xl p-6',
        title: 'text-sm font-bold text-gray-800',
        htmlContainer: 'text-gray-500',
        confirmButton:
          'bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold cursor-pointer order-2',
        cancelButton: 'bg-gray-200 text-gray-700 px-5 py-2 rounded-lg mr-2 cursor-pointer',
      },
    }).then((result) => {
      if (result.isConfirmed) this.removeFromWishlist();
    });
  }
}
