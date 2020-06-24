import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) { }

  register(email: string, password: string) {
    return this.http.post('/user/register', {email, password}, {responseType: 'json', observe: 'response'}).toPromise();
  }

  login(email: string, password: string) {
    return this.http.post('/user/login', {email, password}, {observe: 'response'} ).toPromise();
  }

  logout() {
    localStorage.clear();
  }

  getProfile() {
    return this.http.get('/user/profile', {responseType: 'json', observe: 'response'}).toPromise();
  }

  setJWT(jwt: string) {
    localStorage.setItem('jwt', jwt);
  }

  getJWT(): string {
    return localStorage.getItem('jwt');
  }

}
