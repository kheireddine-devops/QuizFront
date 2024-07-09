import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter, MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {AuthRequest} from "../../../../core/models/user.model";
import {AuthService} from "../../../../core/services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAnchor, MatButton} from "@angular/material/button";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Subscription} from "rxjs";
import {RoleEnum} from "../../../../core/enums/enums";
import {TokenUtilsService} from "../../../../core/services/utils/token-utils.service";

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButton,
    RouterLink,
    NgIf,
    MatAnchor,
    NgOptimizedImage
  ],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.scss'
})
export class SignInPageComponent implements OnInit, OnDestroy {
  protected authInvalid: boolean = false;
  private _authSubscription$: Subscription | undefined;
  protected authFormGroup: UntypedFormGroup;

  constructor(private _authService: AuthService,
              private _tokenUtilsService: TokenUtilsService,
              private _router: Router,
              private _ufb: UntypedFormBuilder) {
    this.authFormGroup = this._ufb.group({
      login: ["", [Validators.required]],
      password: ["", [Validators.required]]
    })
    // this.authFormGroup.patchValue({
    //   login: "kheireddine.dev.ops@gmail.fr",
    //   password: "user"
    // })
  }

  ngOnInit(): void {
  }

  onSignIn() {
    if(this.authFormGroup.valid) {
      const authRequest: AuthRequest = {
        login: this.authFormGroup.controls["login"].value,
        password: this.authFormGroup.controls["password"].value
      }
      this._authSubscription$ = this._authService.login(authRequest)
        .subscribe({
          next: (authResponse) => {
            if(authResponse?.token) {
              this.authInvalid = false;
              this._authService.enableAuth();
              this._tokenUtilsService.saveTokenToLocalStorage(authResponse.token);
              const role = this._tokenUtilsService.getRoleByToken();
              if (role) {
                switch (role) {
                  case RoleEnum.ROLE_ADMIN:
                    this._router.navigateByUrl("/admin/home").then();
                    break;
                  case RoleEnum.ROLE_USER:
                    this._router.navigateByUrl("/user/categories").then();
                    break;
                  default:
                    break;
                }
              }
            }

          },
          error: (error) => {
            this.authInvalid = true;
          }
        })
    }

  }

  ngOnDestroy(): void {
    this._authSubscription$?.unsubscribe();
  }
}
