import {Component} from '@angular/core';
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {Category} from "../../../../core/models/category.model";
import {Subscription} from "rxjs";
import {CategoryService} from "../../../../core/services/category.service";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {Router} from "@angular/router";
import {Result} from "../../../../core/models/result.model";
import {ResultService} from "../../../../core/services/result.service";

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

  private results: Array<Result> = [];
  private _resultSubscription$ : Subscription | undefined;

  constructor(private _categoryService: CategoryService,
              private _resultService: ResultService,
              private _router: Router) {
  }

  ngOnDestroy(): void {
    this._categoriesSubscription$?.unsubscribe();
    this._resultSubscription$?.unsubscribe();
  }

  ngOnInit(): void {
    this._resultSubscription$ = this._resultService.getUserResults().subscribe({
      next: (results: Array<Result>): void => {
        this.results = results;
        this._categoriesSubscription$ = this._categoryService.getAllCategories().subscribe({
          next: (categories: Array<Category>): void => {
            this.categories = categories;
          }
        });
      }
    });
  }

  onTakeQuiz(category: Category): void {
    this._router.navigateByUrl(`/user/test/${category.id}`).then();
  }

  checkPermission(category: Category): boolean {
    const resultIndex = this.results.findIndex(result => result.categoryId === category.id);
    return resultIndex === -1;
  }

  getScore(category: Category): number {
    const resultIndex: number = this.results.findIndex(result => result.categoryId === category.id);
    return (resultIndex !== -1) ? this.results[resultIndex].totalScore : 0;
  }
}
