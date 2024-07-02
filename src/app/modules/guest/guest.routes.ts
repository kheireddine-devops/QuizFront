import { Routes } from '@angular/router';
import {NotFoundComponent} from "../shared/not-found/not-found.component";
import {SignInPageComponent} from "./pages/sign-in-page/sign-in-page.component";
import {SignUpPageComponent} from "./pages/sign-up-page/sign-up-page.component";
import {GuestComponent} from "./guest.component";

export const GUEST_ROUTES: Routes = [
  {
    path: "",
    component: GuestComponent,
    children: [
      { path: "sign-in", component: SignInPageComponent },
      { path: "sign-up", component: SignUpPageComponent },
      { path: "", redirectTo: "/guest/sign-in", pathMatch: "full" },
      { path: "**", component: NotFoundComponent }
    ]
  }
];
