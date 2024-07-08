import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../../../../core/services/category.service";
import {Category} from "../../../../core/models/category.model";
import {Subscription} from "rxjs";
import {JsonPipe} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {AddCategoryComponent} from "../../dialogs/add-category/add-category.component";
import {ConfirmDeleteCategoryComponent} from "../../dialogs/confirm-delete-category/confirm-delete-category.component";
import {ModeEnum} from "../../../../core/models/utils.model";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-admin-category-page',
  standalone: true,
  imports: [
    JsonPipe,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardContent,
    MatGridTile,
    MatGridList,
    MatButtonModule,
    MatIconModule,
    MatDivider
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  protected categories: Array<Category> = [];
  private _categoriesSubscription$ : Subscription | undefined;
  private _deleteCategorySubscription$ : Subscription | undefined;

  constructor(private _categoryService: CategoryService) {
  }

  ngOnDestroy(): void {
    this._categoriesSubscription$?.unsubscribe();
    this._deleteCategorySubscription$?.unsubscribe();
  }

  ngOnInit(): void {
    this._categoriesSubscription$ = this._categoryService.getAllCategories().subscribe({
      next: (categories: Array<Category>): void => {
        this.categories = categories;
      }
    })
  }

  onAddCategory(): void {
    console.log(`ADD CATEGORY`)
    const dialogRef = this.dialog.open(AddCategoryComponent,{
      width: '850px',
      height: '600px',
      data: {
        mode: ModeEnum.CREATION
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (newCategory) => {
          console.log(`AFTER-CLOSE ADD DIALOG: `,newCategory);
          if (newCategory) {
            this.categories.push(newCategory);
          }
        }
    });
  }

  onEitCategory(category: Category): void {
    console.log(`EDIT CATEGORY ${category.id}`)
    const dialogRef = this.dialog.open(AddCategoryComponent,{
      width: '850px',
      height: '600px',
      data: {
        category: category,
        mode: ModeEnum.EDITION
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (updatedCategory) => {
        console.log(`AFTER-CLOSE EDIT DIALOG : `,updatedCategory);
        if (updatedCategory) {
          const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
        }
      }
    });
  }

  onDeleteCategory(category: Category): void {
    console.log(`DELETE CATEGORY ${category.id}`)
    const dialogRef = this.dialog.open(ConfirmDeleteCategoryComponent,{
      width: '380px',
      height: '230px',
      data: {
        category: category
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (confirmed: boolean) => {
        if (confirmed) {
          this._deleteCategorySubscription$ = this._categoryService.deleteCategory(category.id).subscribe({
            next: () => {
              console.log(`Category ${category.id} deleted`);
              console.log(this.categories.filter(_category => _category.id !== category.id))
              this.categories = this.categories.filter(_category => _category.id !== category.id);
            }
          });
        }
      }
    });
  }
}
