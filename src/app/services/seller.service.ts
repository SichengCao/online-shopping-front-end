import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/all`).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to load orders'));
      })
    );
  }

  completeOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/complete`, {}).pipe(
      catchError(error => {
        console.error('Error completing order:', error);
        return throwError(() => new Error('Failed to complete order'));
      })
    );
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/cancel`, {}).pipe(
      catchError(error => {
        console.error('Error canceling order:', error);
        return throwError(() => new Error('Failed to cancel order'));
      })
    );
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products/all`).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to load products'));
      })
    );
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}`).pipe(
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product'));
      })
    );
  }

  getMostProfitableProduct(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/profit/3`).pipe(
      catchError(error => {
        console.error('Error fetching most profitable product:', error);
        return throwError(() => new Error('Failed to load most profitable product'));
      })
    );
  }

  getTopSellingProduct(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/popular/3`).pipe(
      catchError(error => {
        console.error('Error fetching top-selling product:', error);
        return throwError(() => new Error('Failed to load top-selling product'));
      })
    );
  }
}
