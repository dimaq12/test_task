
import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    readonly router: Router,
    readonly auth: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes("login") || req.url.includes("login")) {
      return next.handle(req);
    }
   
    const userData = this.auth.getUser;

    const authReq = userData ? req.clone({
      headers: req.headers.set('Authorization', `Bearer ${userData.token}`),
    }) : req;

    return next.handle(authReq)
    .pipe(
      catchError(res => {
        this.handleError(res);
        throw res;
      })
    );
  }

  private handleError(res: HttpErrorResponse): void {
    if (res.status === 401 || res.status === 403) {
      this.auth.logOut()
    }
  }
}