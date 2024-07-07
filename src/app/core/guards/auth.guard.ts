import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {tap} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService._isLoggedIn$.pipe(
    tap((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.navigateByUrl("/guest/sign-in").then(value => {});
      }
    })
  );
};
