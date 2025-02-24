import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccount, ILogin, LoggedIn } from '../../models/account.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = `${environment.api_url}/auth`;

  private authenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const isLoggedIn = !!localStorage.getItem('loggedAccount');
    this.authenticated.next(isLoggedIn);
    this.authenticated.subscribe((res) => {
      console.log('isLoggedIn => ', res);
    });
  }

  register(account: IAccount): Observable<LoggedIn> {
    this.authenticated.next(true);
    return this.http.post<LoggedIn>(`${this.apiUrl}/register`, account);
  }

  login(login: ILogin): Observable<LoggedIn> {
    this.authenticated.next(true);
    return this.http.post<LoggedIn>(`${this.apiUrl}/login`, login);
  }

  logout() {
    localStorage.clear();
    this.authenticated.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedAccount');
  }
}
