import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'services/auth/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.auth.token;

    const authRequest = req.clone({
      setHeaders: {
        Authorization: `jwt ${accessToken}`,
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });

    return next.handle(authRequest);
  }
}
