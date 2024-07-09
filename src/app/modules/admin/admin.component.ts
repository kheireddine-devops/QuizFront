import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatIconButton} from "@angular/material/button";
import {MenuItem} from "../../core/models/utils.model";
import {UserService} from "../../core/services/user.service";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";
import {AuthService} from "../../core/services/auth.service";
import {UserResponse} from "../../core/models/user.model";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatSidenav,
    MatNavList,
    MatToolbar,
    MatIcon,
    RouterOutlet,
    MatListItem,
    RouterLink,
    MatIconButton,
    JsonPipe,
    RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  menus: Array<MenuItem> = [
    {icon: "dashboard", path: "/admin/home", title: "Dashboard"},
    {icon: "playlist_add", path: "/admin/categories", title: "Quizs"},
    {icon: "list_alt", path: "/admin/results", title: "Results"},
  ];
  users: Array<UserResponse> = [];
  private _usersSubscription$: Subscription | undefined;
  private _signOutSubscription$: Subscription | undefined;

  constructor(private _userService: UserService,
              private _authService: AuthService,
              private _router: Router) {
  }

  ngOnInit(): void {
    this._usersSubscription$ = this._userService.getAllUsers().subscribe({
      next: (users: Array<UserResponse>): void => {
        this.users = users;
      }
    });
  }

  ngOnDestroy(): void {
    this._usersSubscription$?.unsubscribe();
    this._signOutSubscription$?.unsubscribe();
  }

  onSignOut(): void {
    this._signOutSubscription$ = this._authService.logout().subscribe({
      next: (value: boolean): void => {
        if (value) {
          this._router.navigateByUrl("/guest/sign-in").then();
        }
      }
    });
  }
}
