import type { BaseResponse } from "./api";
import type { User } from "./user";

export interface LoginPayload {
  login: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterData {
  user: User;
  expiresIn?: number;
  sessionId?: string;
}

export interface LoginData {
  user: User;
  expiresIn?: number;
  sessionId?: string;
}

export type ForgotPasswordType = {
  email: string;
};
export type ValidateEmail = {
  email: string;
};

export type ValidateUsername = {
  username: string;
};

export type ValidateTokenBody = {
  token: string;
};

export type RestPasswordBody = {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = BaseResponse<RegisterData>;
export type LoginResponse = BaseResponse<LoginData>;
export type ValidateResponse = BaseResponse<{
  available: boolean;
}>;

export type ValidateTokenResponse = BaseResponse<{
  valid: boolean; //false -> sai token
}>;
