import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserService} from './user.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.userService.getJWT();
    if (jwt) {
      request = request.clone({
        setHeaders: {Authorization: this.userService.getJWT()}
      });
    }
    return next.handle(request);
  }
}
