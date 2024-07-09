import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatCardModule} from "@angular/material/card";
import {Category} from "../../../../core/models/category.model";
import {CategoryService} from "../../../../core/services/category.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {JsonPipe, NgClass} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {Option} from "../../../../core/models/option.model";
import {Question} from "../../../../core/models/question.model";
import {ResultService} from "../../../../core/services/result.service";
import {Result} from "../../../../core/models/result.model";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
    MatCardModule,
    JsonPipe,
    MatCheckbox,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.scss'
})
export class TestPageComponent implements OnInit, OnDestroy {
  protected category: Category | undefined;
  private _categorySubscription$: Subscription | undefined;
  private _resultSubscription$: Subscription | undefined;
  protected userTest: Category | undefined;
  protected userTestFormGroup: UntypedFormGroup;
  protected answered: boolean = false;

  constructor(private _categoryService: CategoryService,
              private _resultService: ResultService,
              private _authService: AuthService,
              private _ufb: UntypedFormBuilder,
              private _router: Router,
              private _activatedRoute: ActivatedRoute) {
    this.userTestFormGroup = this._ufb.group({});
  }

  ngOnDestroy(): void {
    this._categorySubscription$?.unsubscribe();
    this._resultSubscription$?.unsubscribe();
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
    const uid: string | null = this._authService.getCurrentUID();
    if (this.category && this.category?.id && uid) {
      const score: number = this.calculateScore();
      this.answered = true;

      const result: Result = {
        userId: uid,
        categoryId: this.category.id,
        totalScore: score
      };
      this._resultSubscription$ = this._resultService.addResult(result).subscribe({
        next: (result: Result): void => {
          if (result) {
            console.log(result)
          }
        }
      });
    }
  }

  private calculateScore(): number {
    let score = 0;
    if (this.category && this.userTest) {
      if (this.category && this.userTest) {
        for (let quizIndex = 0; quizIndex < this.category.quiz.length; quizIndex++) {
          const question = this.category.quiz[quizIndex];
          let questionScore = question.score;
          let allCorrect = true;

          for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
            const option = question.options[optionIndex];
            const formControl = this.userTestFormGroup.get(`question_${quizIndex}_option${optionIndex}`);

            if (formControl?.value !== option.correct) {
              allCorrect = false;
              break;
            }
          }

          if (allCorrect) {
            score += questionScore;
          }
        }
      }
    }
    return score;
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
            const correct: boolean = (this.category?.quiz[i]?.options[j]) ? this.category.quiz[i].options[j].correct: false;
            this.userTestFormGroup.addControl(`question_${i}_option${j}`, this._ufb.control(false));
            this.userTestFormGroup.addControl(`question_${i}_option${j}_correct`, new UntypedFormControl(correct));
          }
        }
      }
    }
  }

  getOptionColor(quizIndex: number, optionIndex: number): string {
    const userResponse = this.userTestFormGroup.get(`question_${quizIndex}_option${optionIndex}`)?.value;
    const correctResponse = this.userTestFormGroup.get(`question_${quizIndex}_option${optionIndex}_correct`)?.value;
    if (this.answered) {
      console.log("userResponse : ",userResponse)
      console.log("correctResponse : ",correctResponse)
      if (userResponse === correctResponse) {
        return 'correct-answer';
      } else {
        return 'incorrect-answer';
      }
    }
    return '';
  }
}
