import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IOrder } from '../models/orders/order.model';
import { IShippingAddress } from '../models/orders/shipping-address.model';

interface ICheckoutSessionResponse {
  session: {
    url: string;
  };
}

interface IOrderMutationResponse {
  message?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly baseURL = environment.baseUrl;

  getUserOrders(userId: string): Observable<IOrder[]> {
    return this.httpClient.get<IOrder[]>(`${this.baseURL}/v1/orders/user/${userId}`);
  }

  createCashOrder(cartId: string, shippingAddress: IShippingAddress): Observable<IOrderMutationResponse> {
    return this.httpClient.post<IOrderMutationResponse>(`${this.baseURL}/v2/orders/${cartId}`, shippingAddress);
  }

  createCheckoutSession(cartId: string, shippingAddress: IShippingAddress): Observable<ICheckoutSessionResponse> {
    const origin = window.location.origin;
    return this.httpClient.post<ICheckoutSessionResponse>(
      `${this.baseURL}/v1/orders/checkout-session/${cartId}`,
      {
        shippingAddress,
      },
      { params: { url: origin } },
    );
  }
}
