import { UserRole } from "./enums";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  passwordHash?: string | null;
  role?: UserRole | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}
