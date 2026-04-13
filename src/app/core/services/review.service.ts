import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IReviewsResponse } from '../models/reviews/reviews-response.model';
import { IReview } from '../models/reviews/review.model';

interface IReviewPayload {
  rating: number;
  review: string;
}

interface IReviewMutationResponse {
  message?: string;
  data: IReview;
}

interface IReviewDeleteResponse {
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  getReviewByProductId(productId: string): Observable<IReviewsResponse> {
    return this.httpClient.get<IReviewsResponse>(
      `${this.baseUrl}/v1/products/${productId}/reviews`,
    );
  }

  addReview(productId: string, body: IReviewPayload): Observable<IReviewMutationResponse> {
    return this.httpClient.post<IReviewMutationResponse>(
      `${this.baseUrl}/v1/products/${productId}/reviews`,
      body,
    );
  }

  updateReview(reviewId: string, body: IReviewPayload): Observable<IReviewMutationResponse> {
    return this.httpClient.put<IReviewMutationResponse>(`${this.baseUrl}/v1/reviews/${reviewId}`, body);
  }

  deleteReview(reviewId: string): Observable<IReviewDeleteResponse> {
    return this.httpClient.delete<IReviewDeleteResponse>(`${this.baseUrl}/v1/reviews/${reviewId}`);
  }
}
