import { Routes } from '@angular/router';
import {AdminComponent} from "./admin.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {CategoryPageComponent} from "./pages/category-page/category-page.component";
import {ResultPageComponent} from "./pages/result-page/result-page.component";
import {NotFoundComponent} from "../shared/not-found/not-found.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "home", component: HomePageComponent },
      { path: "categories", component: CategoryPageComponent },
      { path: "results", component: ResultPageComponent },
      { path: "", redirectTo: "/admin/home", pathMatch: "full" },
      { path: "**", component: NotFoundComponent }
    ]
  }
];
