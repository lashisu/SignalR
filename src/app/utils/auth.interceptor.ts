import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestCounter } from './request-counter';
import { throwError } from 'rxjs';
import { LocalStorageHelper } from './local-storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isLoader: any = true;
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isLoader = req.params.get('loader') == null ? false : true;

    if (LocalStorageHelper.fetch('ClientAuthentication') != null) {
      let ClientAuthentication = LocalStorageHelper.fetch('ClientAuthentication');
      let auth_headers = req.headers.set("Client-Authentication", ClientAuthentication);
      req = req.clone({
        headers: auth_headers
      });
    }

    let headers = req.headers.set("Authorization", 'Bearer ' + LocalStorageHelper.fetch('token'));
    req = req.clone({
      headers: headers
    });

    if (this.isLoader) {
      RequestCounter.increment();
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (this.isLoader) {
            RequestCounter.decrement();
          }
        }
        else if (event instanceof HttpErrorResponse) {
          if (this.isLoader) {
            RequestCounter.decrement();
          }
        }
      }, error => {
        if (this.isLoader) {
          RequestCounter.decrement();
        }
        return throwError(error);
      })
    )
  }
}