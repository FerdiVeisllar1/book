import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://booking-api.asystems.al/api';
  private token: string | null = null;
  private userIdKey = 'userId'; // Store key as a constant
  constructor(private http: HttpClient, private router: Router) {}


  setUserId(id: string) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
      console.log('✅ User ID stored:', id);
    } else {
      console.error('❌ Tried to store an undefined/null userId');
    }
  }

  getUserId(): string | null {
    const storedId = localStorage.getItem('userId');
    console.log('📦 Getting userId from storage:', storedId);
    return storedId;
  }

  clearUserId() {
    localStorage.removeItem(this.userIdKey);
    console.log('🚀 User ID cleared from storage');
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Authentication/Login`, { email, password });
  }
  setToken(token: string, role: string, userId: string): void { // ✅ Add userId
    this.token = token;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('userId', userId);  // ✅ Now storing userId properly
  }



  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');  // ✅ Remove role on logout
    console.log("User logged out, token removed");
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');  // ✅ Read role from localStorage
  }
}
