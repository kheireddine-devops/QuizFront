import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models/category.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _http: HttpClient) { }

  getAllCategories() : Observable<Array<Category>>{
    return this._http.get<Array<Category>>(`${environment.quizBackUrl}/category/all`);
  }

  addCategory(category: Category): Observable<Category> {
    return this._http.post<Category>(`${environment.quizBackUrl}/category`,category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this._http.put<Category>(`${environment.quizBackUrl}/category/${category.id}`,category);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this._http.delete<any>(`${environment.quizBackUrl}/category/${categoryId}`);
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this._http.get<Category>(`${environment.quizBackUrl}/category/${categoryId}`);
  }
}
