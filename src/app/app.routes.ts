import { Routes } from '@angular/router';
import {NotFoundComponent} from "./modules/shared/not-found/not-found.component";
import {authGuard} from "./core/guards/auth.guard";
import {isAdminGuard} from "./core/guards/is-admin.guard";
import {isUserGuard} from "./core/guards/is-user.guard";

export const routes: Routes = [
  {
    path: "guest",
    loadChildren: () => import("./modules/guest/guest.routes").then(routes => routes.GUEST_ROUTES )
  },
  {
    path: "admin",
    loadChildren: () => import("./modules/admin/admin.routes").then(routes => routes.ADMIN_ROUTES ),
    canActivate: [authGuard, isAdminGuard]
  },
  {
    path: "user",
    loadChildren: () => import("./modules/user/user.routes").then(routes => routes.USER_ROUTES ),
    canActivate: [authGuard, isUserGuard]
  },
  { path: "", redirectTo: "/guest", pathMatch: "full" },
  { path: "**", component: NotFoundComponent }
];
