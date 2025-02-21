import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./services/auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService:AuthService){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const authToken = this.authService.getToken();

      const authReq = request.clone({
        headers: request.headers.set('Authorization',`Bearer ${authToken}`)
      });

      return next.handle(authReq);
  }
}
