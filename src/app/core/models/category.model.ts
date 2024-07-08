import {Question} from "./question.model";

export interface Category {
  id: string;
  name: string;
  description: string;
  quiz: Array<Question>;
}
