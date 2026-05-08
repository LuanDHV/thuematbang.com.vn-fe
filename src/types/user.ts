export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  passwordHash?: string | null;
  role?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}
