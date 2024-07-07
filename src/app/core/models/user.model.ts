export interface AuthRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export enum RoleEnum {
  ROLE_ADMIN="ROLE_ADMIN",
  ROLE_USER="ROLE_USER",
}

export enum GenderEnum {
  MALE="MALE",
  FEMALE="FEMALE"
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  birthDate: Date;
  gender: GenderEnum;
  email: string;
  role: RoleEnum;
}
