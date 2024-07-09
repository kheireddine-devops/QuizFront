import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatCardModule} from "@angular/material/card";
import {Category} from "../../../../core/models/category.model";
import {CategoryService} from "../../../../core/services/category.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {JsonPipe} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {Option} from "../../../../core/models/option.model";
import {Question} from "../../../../core/models/question.model";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    MatCardModule,
    JsonPipe,
    MatCheckbox,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent implements OnInit, OnDestroy {
  protected category: Category | undefined;
  private _categorySubscription$: Subscription | undefined;
  protected userTest: Category | undefined;
  protected userTestFormGroup: UntypedFormGroup;

  constructor(private _categoryService: CategoryService,
              private _ufb: UntypedFormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    this.userTestFormGroup = this._ufb.group({});
  }

  ngOnDestroy(): void {
    this._categorySubscription$?.unsubscribe();
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe({
      next: (params) => {
        const id = params["categoryId"];
        if (id) {
          this._categorySubscription$ = this._categoryService.getCategoryById(id).subscribe({
            next: (category): void => {
              if (category) {
                this.category = category;
                this.userTest = this.initTest(category);
                this.initTestFormGroup(this.userTest);
              }
            }
          });
        }
      }
    })

  }

  onValidateTest(): void {
    if (this.category && this.userTest) {
      if (this.category && this.userTest) {
        let score = 0;

        for (let quizIndex = 0; quizIndex < this.category.quiz.length; quizIndex++) {
          const question = this.category.quiz[quizIndex];
          let questionScore = question.score;
          let allCorrect = true;

          for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
            const option = question.options[optionIndex];
            const formControl = this.userTestFormGroup.get(`question_${quizIndex}_option${optionIndex}`);

            if (formControl?.value !== option.correct) {
              allCorrect = false;
              break;t status
            }
          }

          if (allCorrect) {
            score += questionScore;
          }
        }

        alert(`Your score is: ${score}`);
      }
    }
  }

  private initTest(category: Category): Category {
    const test: Category = { ...category, quiz: [] };

    if (category?.quiz) {
      for (let i = 0; i < category.quiz.length; i++) {
        const question: Question = category.quiz[i];
        const testQuestion: Question = { ...question, options: [] };

        if (question?.options) {
          for (let j = 0; j < question.options.length; j++) {
            const option = question.options[j];
            const testOption: Option = { ...option, correct: false };

            testQuestion.options.push(testOption);
          }
        }

        test.quiz.push(testQuestion);
      }
    }
    return test;
  }

  private initTestFormGroup(category: Category | undefined) {
    if (category?.quiz) {
      for (let i = 0; i < category.quiz.length; i++) {
        if (category.quiz[i]?.options) {
          for (let j = 0; j < category.quiz[i]?.options.length; j++) {
            this.userTestFormGroup.addControl(`question_${i}_option${j}`, this._ufb.control(false));
          }
        }
      }
    }
  }
}
