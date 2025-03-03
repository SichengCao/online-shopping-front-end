import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // Standalone service
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Login Method
   * @param credentials - { username, password }
   * @returns Observable<{ token: string; seller: boolean }>
   */
  login(credentials: { username: string, password: string }) {
    return this.http.post<{ token: string; seller: boolean }>(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Register a new user
   * @param userData - { username, email, password, isSeller }
   * @returns Observable<string> (responseType: 'text' used for non-JSON responses)
   */
  register(userData: { username: string; email: string; password: string; isSeller: boolean }) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { responseType: 'text' });
  }

  /**
   * Save user authentication data
   * @param token - JWT token
   * @param isSeller - Whether the user is a seller
   */
  saveUserData(token: string, isSeller: boolean) {
    localStorage.setItem('token', token);
    localStorage.setItem('isSeller', JSON.stringify(isSeller));
    localStorage.setItem('role', isSeller ? 'SELLER' : 'CUSTOMER'); // ✅ Store role for future use
  }

  /**
   * Check if the logged-in user is a seller
   * @returns boolean
   */
  isSeller(): boolean {
    return JSON.parse(localStorage.getItem('isSeller') || 'false');
  }

  /**
   * Check if the user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Get the role of the logged-in user (CUSTOMER or SELLER)
   * @returns 'SELLER' | 'CUSTOMER' | null
   */
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  /**
   * Logout the user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isSeller');
    localStorage.removeItem('role'); // ✅ Ensure role is also cleared
  }

  /**
   * Fetch product details with authorization
   * @param productId - The product ID
   * @returns Observable<any>
   */
  getProductDetails(productId: string) {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();

    return this.http.get<any>(`${this.apiUrl}/products/${productId}`, { headers });
  }
}
