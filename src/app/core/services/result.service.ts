import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Result} from "../models/result.model";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private _http: HttpClient) { }

  addResult(result: Result): Observable<Result> {
    return this._http.post<Result>(`${environment.quizBackUrl}/result`,result);
  }

  getUserResults(): Observable<Array<Result>> {
    return this._http.get<Array<Result>>(`${environment.quizBackUrl}/result`);
  }
}
