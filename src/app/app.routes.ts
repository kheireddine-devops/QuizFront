import { Routes } from '@angular/router';
import {NotFoundComponent} from "./modules/shared/not-found/not-found.component";

export const routes: Routes = [
  { path: "guest", loadChildren: () => import("./modules/guest/guest.routes").then(routes => routes.GUEST_ROUTES ) },
  { path: "admin", loadChildren: () => import("./modules/admin/admin.routes").then(routes => routes.ADMIN_ROUTES ) },
  { path: "user", loadChildren: () => import("./modules/user/user.routes").then(routes => routes.USER_ROUTES ) },
  { path: "", redirectTo: "/guest", pathMatch: "full" },
  { path: "**", component: NotFoundComponent }
];
