import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {UserRequest} from "../../../../core/models/user.model";
import {UserService} from "../../../../core/services/user.service";
import {Subscription} from "rxjs";
import { MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {GenderEnum} from "../../../../core/enums/enums";
import {
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatIconModule} from "@angular/material/icon";
import { MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterLink,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatSelect,
    MatOption
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.scss'
})
export class SignUpPageComponent implements OnInit, OnDestroy {
  protected signUpFormGroup: UntypedFormGroup;
  private _userSubscription$: Subscription | undefined;
  protected registerInvalid:boolean = false;
  protected messageError: string = "";

  constructor(private _userService: UserService,
              private _router: Router,
              private _ufb: UntypedFormBuilder) {

    this.signUpFormGroup = this._ufb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // this.signUpFormGroup.patchValue({
    //   firstname: "kheirieddine",
    //   lastname: "mechergui",
    //   birthDate: new Date(2000,5,19),
    //   gender: GenderEnum.MALE,
    //   email: `kheireddine.mechergui@gmail.com`,
    //   password: "abcABC123$"
    // })
  }

  onSignUp(): void {
    if (this.signUpFormGroup.valid) {
      const newUser: UserRequest = {
        firstname: this.signUpFormGroup.controls['firstname'].value,
        lastname: this.signUpFormGroup.controls['lastname'].value,
        birthDate: this.signUpFormGroup.controls['birthDate'].value,
        gender: this.signUpFormGroup.controls['gender'].value,
        email: this.signUpFormGroup.controls['email'].value,
        password: this.signUpFormGroup.controls['password'].value,
      };

      this._userSubscription$ = this._userService.signUp(newUser).subscribe({
        next: (userResponse) => {
          if (userResponse) {
            this._router.navigateByUrl('/guest/sign-in').then();
          }
        },
        error: (response): void => {
          console.log(response)
          if (response?.error) {
            this.registerInvalid = true;
            if (response?.error?.message) {
              this.messageError = response?.error?.message;
            }
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._userSubscription$?.unsubscribe();
    this.signUpFormGroup.reset();
  }

  protected readonly GenderEnum = GenderEnum;
}
