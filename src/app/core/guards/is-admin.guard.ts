import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {RoleEnum} from "../models/user.model";

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if(!authService.hasRole(RoleEnum.ROLE_ADMIN)) {
    router.navigateByUrl("/guest/sign-in").then();
    return false;
  }
  return true;
};
