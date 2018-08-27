import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  loggedInSuccessfully = new Subject();
  loginErrors = new Subject();
  signUpErrors = new Subject();

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(data) {
    return this.http.post('/api/users/login', data).subscribe(
      data => {
        this.setAuthToken(data['token']);
        this.router.navigate(['/recipes']);
        this.loggedInSuccessfully.next();
      },
      err => this.loginErrors.next(err)
    );
  }

  signup(data) {
    return this.http.post('/api/users/register', data).subscribe(
      data => {
        this.router.navigate(['/recipes']);
      },
      err => this.signUpErrors.next(err)
    );
  }

  private setAuthToken(token) {
    localStorage.setItem('jwtToken', token);
  }

  getCurrentUser() {
    const token = this.getAuthToken();
    if (token) {
      const { id, name, avatar, exp } = this.jwtHelper.decodeToken(token);
      const currentUser = new User(id, name, avatar, exp);
      return currentUser;
    }
    return null;
  }

  getAuthToken() {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}