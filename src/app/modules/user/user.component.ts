import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MenuItem} from "../../core/models/utils.model";
import {AuthService} from "../../core/services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  menus: Array<MenuItem> = [
    {icon: "playlist_add", path: "/user/categories", title: "Quizs"},
    {icon: "list_alt", path: "/user/results", title: "Results"},
  ];
  private _signOutSubscription$: Subscription | undefined;

  constructor(private _authService: AuthService,
              private _router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
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
