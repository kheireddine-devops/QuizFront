import {Component} from '@angular/core';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {Category} from "../../../../core/models/category.model";
import {Subscription} from "rxjs";
import {CategoryService} from "../../../../core/services/category.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Router} from "@angular/router";

@Component({
  selector: 'app-category-page',
  standalone: true,
    imports: [
      MatButton,
      MatCard,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      MatCard,
      MatCardHeader,
      MatCardSubtitle,
      MatCardTitle,
      MatCardContent,
      MatGridTile,
      MatGridList,
      MatButtonModule,
      MatIconModule
    ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent {
  protected categories: Array<Category> = [];
  private _categoriesSubscription$ : Subscription | undefined;

  constructor(private _categoryService: CategoryService,
              private _router: Router) {
  }

  ngOnDestroy(): void {
    this._categoriesSubscription$?.unsubscribe();
  }

  ngOnInit(): void {
    this._categoriesSubscription$ = this._categoryService.getAllCategories().subscribe({
      next: (categories: Array<Category>): void => {
        this.categories = categories;
      }
    })
  }

  onTakeQuiz(category: Category): void {
    this._router.navigateByUrl(`/user/test/${category.id}`).then();
  }
}
