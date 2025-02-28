import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // Standalone 直接注入，不需要 NgModule
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string; seller: boolean }>(`${this.apiUrl}/auth/login`, credentials);
  }


  register(userData: { username: string; email: string; password: string; isSeller: boolean }) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { responseType: 'text' }); // ✅ 解析 `text`
  }

  saveUserData(token: string, isSeller: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isSeller', JSON.stringify(isSeller));
  }

  isSeller(): boolean {
    return JSON.parse(localStorage.getItem('isSeller') || 'false');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isSeller');
  }



}
