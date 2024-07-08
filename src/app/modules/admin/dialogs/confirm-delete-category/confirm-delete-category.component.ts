import {Component, inject, model} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ConfirmDeleteCategoryDialogData} from "../../../../core/models/utils.model";
import {JsonPipe} from "@angular/common";
import {CategoryService} from "../../../../core/services/category.service";

@Component({
  selector: 'app-confirm-delete-category',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    JsonPipe
  ],
  templateUrl: './confirm-delete-category.component.html',
  styleUrl: './confirm-delete-category.component.scss'
})
export class ConfirmDeleteCategoryComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDeleteCategoryComponent>);
  readonly data = inject<ConfirmDeleteCategoryDialogData>(MAT_DIALOG_DATA);


  constructor(private _categoryService: CategoryService) {
  }

  onDeleteCategory() {
    this.dialogRef.close(true);
  }
}
