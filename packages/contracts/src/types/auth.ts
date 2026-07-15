import type { User } from "./user.js";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
};
