import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  getAllUsers(): Observable<Array<User>> {
    return this._http.get<Array<User>>(`${environment.quizBackUrl}/users/all`);
  }
}
