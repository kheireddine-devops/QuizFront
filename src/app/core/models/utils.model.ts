import {Category} from "./category.model";

export interface MenuItem {
  path: string;
  icon: string;
  title: string;
}

export interface AddCategoryDialogData {
  category: Category;
  mode: ModeEnum;
}

export interface ConfirmDeleteCategoryDialogData {
  category: Category;
}

export enum ModeEnum {
  CREATION="CREATION",
  EDITION="EDITION"
}
