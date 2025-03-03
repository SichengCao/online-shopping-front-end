import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8081/watchlist';

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('用户未登录');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  addToWatchlist(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('用户未登录');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/${productId}`, {}, { headers, responseType: 'text' }); //  让 Angular 解析文本
  }


  removeFromWatchlist(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('用户未登录');
      return new Observable(observer => {
        observer.error('用户未登录');
        observer.complete();
      });
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/${productId}`, { headers, responseType: 'text' })  // 👈 明确指定 responseType 避免解析问题
      .pipe(
        catchError(err => {
          console.error(`删除商品失败: ${err.message}`);
          return throwError(() => new Error('删除失败，请稍后重试'));
        })
      );
  }



  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  //  获取 Token
    if (!token) {
      console.error('用户未登录，缺少 Token');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
