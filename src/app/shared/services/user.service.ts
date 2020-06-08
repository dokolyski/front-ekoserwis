import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) { }

  register(email: string, password: string) {
    return this.http.post('/user/register', {email, password}).toPromise();
  }

  login(email: string, password: string) {
    return this.http.post('/user/login', {email, password}, {observe: 'response'} ).toPromise();
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getProfile() {
    return this.http.get('/user/profile', {headers: {Authorization: this.getJWT()}}).toPromise();
  }

  setJWT(jwt: string) {
    localStorage.setItem('jwt', jwt);
  }

  getJWT(): string {
    return localStorage.getItem('jwt');
  }

}
