import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Erreur inconnue';
        if (error.error instanceof ErrorEvent) {
          message = `Erreur: ${error.error.message}`;
        } else {
          message = `Code: ${error.status}\nMessage: ${error.message}`;
          if (error.error && error.error.message) {
            message = error.error.message;
          }
        }
        console.error('HTTP Error:', message);
        return throwError(() => new Error(message));
      })
    );
  }
}
