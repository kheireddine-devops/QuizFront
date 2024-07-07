import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {AuthRequest, AuthResponse} from "../models/user.model";
import {TokenUtilsService} from "./utils/token-utils.service";
import {RoleEnum} from "../enums/enums";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient,
              private _tokenUtilsService: TokenUtilsService) {

    if(this._tokenUtilsService.existTokenInLocalStorage()) {
      this.enableAuth();
    }
  }

  login(authRequest:AuthRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${environment.quizBackUrl}/auth`,authRequest);
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      tap(value => {
        this._tokenUtilsService.deleteTokenInLocalStorage();
        this.disabledAuth();
      })
    );
  }

  getToken(): string | null {
    return this._tokenUtilsService.getTokenFromLocalStorage();
  }

  hasRole(role: RoleEnum): boolean {
    const tokenRole = this._tokenUtilsService.getRoleByToken();
    if (role && tokenRole) {
      return role === tokenRole;
    }
    return false;
  }

  _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enableAuth() {
    this._isLoggedIn$.next(true);
  }
  disabledAuth() {
    this._isLoggedIn$.next(false);
  }
}
