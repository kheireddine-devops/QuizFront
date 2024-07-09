import {GenderEnum, RoleEnum} from "../enums/enums";

export interface AuthRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserRequest {
  firstname: string;
  lastname: string;
  birthDate: Date;
  gender: GenderEnum;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstname: string;
  lastname: string;
  birthDate: Date;
  gender: GenderEnum;
  email: string;
  role: RoleEnum;
}
