import { Injectable } from '@angular/core';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {RoleEnum} from "../../enums/enums";


@Injectable({
  providedIn: 'root'
})
export class TokenUtilsService {

  private readonly TOKEN_NAME = "token";

  constructor() { }

  saveTokenToLocalStorage(token: string): boolean {
    localStorage.setItem(this.TOKEN_NAME ,token);
    return true;
  }
  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }
  existTokenInLocalStorage(): boolean {
    return localStorage.getItem(this.TOKEN_NAME) !== null;
  }
  deleteTokenInLocalStorage(): boolean {
    localStorage.removeItem(this.TOKEN_NAME);
    return true;
  }

  decode(token: string): JwtPayload {
    return jwtDecode(token);
  }

  verify(token: string): boolean {
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      if (!decodedToken || !decodedToken.exp) {
        return false;
      }

      const currentTime: number = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        return false;
      }

      const verifiedToken: any = jwtDecode(token);
      return !!verifiedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  }

  isExpired(token: string): boolean {
    const decodedToken: JwtPayload = this.decode(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime: number = Date.now() / 1000;
    console.log(`${decodedToken.exp} < ${currentTime} : ${decodedToken.exp < currentTime}`)
    console.log(`${new Date(decodedToken.exp).getUTCDate()} < ${new Date(currentTime).getUTCDate()}`)
    return decodedToken.exp < currentTime;
  }

  hasClaim(token: string, claimName: string): boolean {
    const decodedToken: JwtPayload = this.decode(token);
    return decodedToken.hasOwnProperty(claimName);
  }

  getClaim(token: string, claimName: string): any | undefined {
    const decodedToken: JwtPayload = this.decode(token);
    if(decodedToken && decodedToken.hasOwnProperty(claimName)) {
      // @ts-ignore
      return decodedToken[claimName];
    }
    return undefined;
  }

  getClaims(token: string): JwtPayload {
    return this.decode(token);
  }

  getRoleByToken(): RoleEnum | null {
    const token = this.getTokenFromLocalStorage();
    if(token && this.hasClaim(token,"scope")) {
      return this.getClaim(token,"scope");
    }
    return null;
  }
}
