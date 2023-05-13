import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache = new Map<string, HttpResponse<any>>();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        const res = this.cache.get(req.urlWithParams);
        if (res) {
            return of(res);
        }

        return next.handle(req).pipe(
            tap((res) => {
                if (res instanceof HttpResponse) {
                    this.cache.set(req.urlWithParams, res);
                }
            })
        );
    }
}