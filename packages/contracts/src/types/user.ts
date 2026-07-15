export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  phoneNormalized?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  passwordHash?: string | null;
  hasPassword?: boolean;
  authProvider?: import("../enums/index.js").AuthProvider;
  role: import("../enums/index.js").UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}
