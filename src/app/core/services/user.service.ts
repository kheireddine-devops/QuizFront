import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { UserRequest, UserResponse} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getAllUsers(): Observable<Array<UserResponse>> {
    return this._http.get<Array<UserResponse>>(`${environment.quizBackUrl}/users/all`);
  }


  signUp(newUser: UserRequest): Observable<UserResponse> {
    return this._http.post<UserResponse>(`${environment.quizBackUrl}/register`,newUser);
  }
}
