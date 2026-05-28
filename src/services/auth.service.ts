import { postApiData } from "./shared/api-client";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authService = {
  login: (payload: LoginPayload) =>
    postApiData<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    postApiData<AuthResponse>("/auth/register", payload),

  refresh: () => postApiData<AuthResponse>("/auth/refresh"),

  logout: () => postApiData<{ ok?: boolean; message?: string }>("/auth/logout"),
};


