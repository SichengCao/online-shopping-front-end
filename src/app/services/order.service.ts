import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {map, Observable, of, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8081/orders';

  constructor(private router: Router, private http: HttpClient) {}

  //  统一获取 Token 并创建 Headers
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log("🛠 发送请求时的 Token:", token);  //  打印 Token
    if (!token) {
      alert('请先登录！');
      throw new Error('用户未登录');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }


  //  获取订单列表
  getOrders(): Observable<any[]> {
    try {
      const headers = this.createAuthHeaders();
      return this.http.get<any[]>(this.baseUrl, { headers }).pipe(
        catchError((error) => this.handleError(error)) // ⬅ 显式传递 error
      );
    } catch (error) {
      return throwError(() => new Error((error as Error).message)); // ✅ 断言 error 为 Error
    }
  }

  //  下单
  placeOrder(cartItems: any[]): Observable<any> {
    try {
      const headers = this.createAuthHeaders();

      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity || 1
        }))
      };

      console.log(" 发送请求到后端:", JSON.stringify(orderPayload));

      return this.http.post<{ message: string }>(`${this.baseUrl}`, orderPayload, { headers })
        .pipe(
          tap(response => {
            console.log(" 订单提交成功:", response);
            if (response && response.message === "订单创建成功") {
              this.router.navigate(['/home']);
            }
          }),
          catchError((error) => this.handleError(error)) // ⬅ 显式传递 error
        );
    } catch (error) {
      return throwError(() => new Error((error as Error).message)); //  断言 error 为 Error
    }
  }

  //  支付订单
  payOrder(orderId: number): Observable<any> {
    try {
      const headers = this.createAuthHeaders();
      const apiUrl = `${this.baseUrl}/${orderId}/pay`;
      console.log(`🚀 发送支付订单请求: ${apiUrl}`);
      console.log("🛠 发送请求时的 Token:", localStorage.getItem('token'));  // 打印 Token

      return this.http.patch(apiUrl, {}, { headers, responseType: 'text' }).pipe(
        map((response: string) => {
          console.log(`✅ 订单 ${orderId} 已支付，服务器返回:`, response);
          return { success: response.includes("订单已支付"), message: response };
        }),
        catchError((error) => {
          console.error(`❌ 支付订单失败 (ID: ${orderId})`, error);
          return of({ success: false, message: "支付订单失败" }); // ✅ 这里改成返回 Observable，而不是 throwError
        })
      );
    } catch (error) {
      console.error("❌ 支付订单错误", error);
      return of({ success: false, message: "支付订单失败" }); // ✅ 这里也返回 Observable
    }
  }


  cancelOrder(orderId: number): Observable<any> {
    try {
      const headers = this.createAuthHeaders();
      const apiUrl = `${this.baseUrl}/${orderId}/cancel`;

      console.log(`🚀 发送取消订单请求: ${apiUrl}`);
      console.log("🛠 发送请求时的 Token:", localStorage.getItem('token'));

      return this.http.patch(apiUrl, {}, { headers, responseType: 'text' }).pipe(
        map((response: string) => {
          console.log(`订单 ${orderId} 已取消，服务器返回:`, response);
          return { success: response.includes("订单已取消"), message: response };
        }),
        tap(() => console.log(`✅ 订单 ${orderId} 取消成功`)),
        catchError((error) => {
          console.error(`❌ 取消订单失败 (ID: ${orderId})`, error);
          return throwError(() => new Error("取消订单失败"));
        })
      );
    } catch (error) {
      console.error("❌ 取消订单出错", error);
      return throwError(() => new Error("取消订单失败"));
    }

  }



  //  处理 HTTP 请求错误（已修正 TS18046）
  private handleError(error: unknown): Observable<never> {
    console.error(" 请求失败:", error);
    let errorMsg = "发生错误，请稍后重试。";

    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        errorMsg = "请求格式错误，请检查订单信息";
      } else if (error.status === 401) {
        errorMsg = "认证失败，请重新登录";
      } else if (error.status === 404) {
        errorMsg = "资源未找到";
      }
    } else if (error instanceof Error) {
      errorMsg = error.message; //  确保 error.message 可用
    }

    alert(errorMsg);
    return throwError(() => new Error(errorMsg));
  }
}
