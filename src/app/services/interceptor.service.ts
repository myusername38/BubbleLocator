import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';

@Injectable()
export class InterceptorService implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // All HTTP requests are going to go through this method
       return 'chuck norris';
   }
}

