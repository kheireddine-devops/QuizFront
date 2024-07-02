import { Routes } from '@angular/router';
import {NotFoundComponent} from "../shared/not-found/not-found.component";
import {CategoryPageComponent} from "./pages/category-page/category-page.component";
import {ResultPageComponent} from "./pages/result-page/result-page.component";
import {UserComponent} from "./user.component";

export const USER_ROUTES: Routes = [
  {
    path: "",
    component: UserComponent,
    children: [
      { path: "categories", component: CategoryPageComponent },
      { path: "results", component: ResultPageComponent },
      { path: "", redirectTo: "/user/categories", pathMatch: "full" },
      { path: "**", component: NotFoundComponent }
    ]
  }
];
