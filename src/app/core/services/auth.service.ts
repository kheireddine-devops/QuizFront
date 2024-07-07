import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {AuthRequest, AuthResponse} from "../models/user.model";
import {TokenUtilsService} from "./utils/token-utils.service";
import {RoleEnum} from "../enums/enums";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(private _http: HttpClient,
              private _tokenUtilsService: TokenUtilsService) {

    if(this._tokenUtilsService.existTokenInLocalStorage()) {
      this._isLoggedIn$.next(true);
    }
  }

  login(authRequest:AuthRequest): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`/api/auth`,authRequest);
  }

  logout(): Observable<boolean> {
    this._tokenUtilsService.deleteTokenInLocalStorage();
    return of(true)
      .pipe(
        tap(response => {
          this._tokenUtilsService.deleteTokenInLocalStorage();
          this._isLoggedIn$.next(false);
        })
      )
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
}
