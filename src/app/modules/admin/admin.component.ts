import { Component } from '@angular/core';
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatIconButton} from "@angular/material/button";
import {MenuItem} from "../../core/models/utils.model";

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
    MatIconButton
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  menus: Array<MenuItem> = [
    {icon: "dashboard", path: "/admin/home", title: "Dashboard"},
    {icon: "playlist_add", path: "/admin/categories", title: "Quizs"},
    {icon: "list_alt", path: "/admin/results", title: "Results"},
  ]
}
