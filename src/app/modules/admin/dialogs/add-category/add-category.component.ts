import {Component, inject, model, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogModule, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {AddCategoryDialogData, ModeEnum} from "../../../../core/models/utils.model";
import {JsonPipe} from "@angular/common";
import {ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Question} from "../../../../core/models/question.model";
import {Category} from "../../../../core/models/category.model";
import {CategoryService} from "../../../../core/services/category.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import { MatCheckboxModule} from "@angular/material/checkbox";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    MatDialogTitle,
    MatButton,
    JsonPipe,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MatCheckboxModule,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddCategoryComponent>);
  readonly data = inject<AddCategoryDialogData>(MAT_DIALOG_DATA);
  readonly category = model(this.data.category);

  protected readonly ModeEnum = ModeEnum;
  protected categoryFormGroup: UntypedFormGroup;

  constructor(private _ufb: UntypedFormBuilder,
              private _categoryService: CategoryService) {

    this.categoryFormGroup = this.createFormGroup(FormPart.CATEGORY);
  }

  ngOnInit(): void {
    if (this.data.mode === ModeEnum.EDITION) {
      this.initEditionFormGroup(this.data.category);
      this.categoryFormGroup.patchValue(this.data.category);
    } else {
      this.initCreationFormGroup();
    }
  }

  onAddCategory() {
    console.log("ADD CATEGORY")
    if (this.categoryFormGroup.valid) {
      const category: Category = this.categoryFormGroup.value;
      this._categoryService.addCategory(category).subscribe({
        next: (newCategory): void => {
          if (newCategory) {
            console.log(newCategory);
            this.dialogRef.close(newCategory);
          }
        }
      })
    }
  }

  onEditCategory() {
    console.log("EDIT CATEGORY");
    if (this.categoryFormGroup.valid) {
      const category: Category = this.categoryFormGroup.value;
      category.id = this.data.category.id;
      this._categoryService.updateCategory(category).subscribe({
        next: (updatedCategory): void => {
          if (updatedCategory) {
            this.dialogRef.close(updatedCategory);
          }
        }
      });
    }
  }

  private createFormGroup(part: FormPart): UntypedFormGroup {
    let untypedFormGroup: UntypedFormGroup = this._ufb.group({});
    switch (part) {
      case FormPart.CATEGORY:
        untypedFormGroup.addControl("name", this._ufb.control("", [Validators.required]));
        untypedFormGroup.addControl("description", this._ufb.control("", [Validators.required]));
        untypedFormGroup.addControl("quiz", this._ufb.array([]));
        break;
      case FormPart.QUESTION:
        // untypedFormGroup.addControl("idCategory", this._ufb.control("", [Validators.required]));
        untypedFormGroup.addControl("description", this._ufb.control("", [Validators.required]));
        untypedFormGroup.addControl("score", this._ufb.control(0, [Validators.required]));
        untypedFormGroup.addControl("options", this._ufb.array([]));
        break;
      case FormPart.OPTION:
        untypedFormGroup.addControl("description", this._ufb.control("", [Validators.required]));
        untypedFormGroup.addControl("correct", this._ufb.control(false, [Validators.required]));
        break;
    }
    return untypedFormGroup;
  }

  get questions(): UntypedFormArray {
    return this.categoryFormGroup.get('quiz') as UntypedFormArray;
  }

  getOptions(questionIndex: number): UntypedFormArray {
    return this.questions.at(questionIndex).get('options') as UntypedFormArray;
  }

  addQuestion() {
    const questionGroup = this.createFormGroup(FormPart.QUESTION);
    this.questions.push(questionGroup);
  }

  addOption(event: Event,questionIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    const options = this.getOptions(questionIndex);
    const optionGroup = this.createFormGroup(FormPart.OPTION);
    options.push(optionGroup);
  }

  onDeleteQuestion(index: number): void {
    console.log(`DELETE QUESTION ${index}`);
    this.questions.removeAt(index);
  }

  onDeleteQuestionOption(questionIndex: number, optionIndex: number): void {
    console.log(`DELETE OPTION ${questionIndex} / ${optionIndex}`);
    const options = this.getOptions(questionIndex);
    options.removeAt(optionIndex);
  }

  private initEditionFormGroup(category: Category): void {
    if (category.quiz) {
      for (let i = 0; i < category.quiz.length; i++) {
        const question = category.quiz[i];
        const questionGroup = this.createFormGroup(FormPart.QUESTION);

        if (question.options) {
          for (let j = 0; j < question.options.length; j++) {
            const optionGroup = this.createFormGroup(FormPart.OPTION);
            (questionGroup.get('options') as UntypedFormArray).push(optionGroup);
          }

          (this.categoryFormGroup.get('quiz') as UntypedFormArray).push(questionGroup);
        }
      }
    }
  }

  private initCreationFormGroup() {
    const defaultQuestionGroup = this.createFormGroup(FormPart.QUESTION);
    (defaultQuestionGroup.get('options') as UntypedFormArray).push(this.createFormGroup(FormPart.OPTION));
    (this.categoryFormGroup.get('quiz') as UntypedFormArray).push(defaultQuestionGroup);
  }
}

enum FormPart {
  CATEGORY="CATEGORY",
  QUESTION="QUESTION",
  OPTION="OPTION"
}
