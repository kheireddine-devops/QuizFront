import {Option} from "./option.model";

export interface Question {
  id: string;
  idCategory: string;
  description: string;
  score: number;
  options: Array<Option>;
}
