import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import { axiosInstance } from "./auth-client";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthState,
  getRefreshToken,
  getAccessToken,
} from "./auth-store";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data } = await axios.post(`${BASE}/auth/login`, {
      identifier: email,
      password,
    });

    const accessToken = data.accessToken || data.data?.accessToken;
    const refreshToken = data.refreshToken || data.data?.refreshToken;

    if (!accessToken) {
      return {
        success: false,
        error: { message: "Login failed", name: "LoginError" },
      };
    }

    setAccessToken(accessToken);
    if (refreshToken) setRefreshToken(refreshToken);

    return { success: true, redirectTo: "/" };
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore
    }
    clearAuthState();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    if (getAccessToken()) {
      return { authenticated: true };
    }

    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      return { authenticated: false, redirectTo: "/login", logout: true };
    }

    try {
      const { data } = await axios.post(`${BASE}/auth/refresh`, {
        refreshToken: storedRefreshToken,
      });

      const accessToken = data.accessToken || data.data?.accessToken;
      const newRefreshToken = data.refreshToken || data.data?.refreshToken;

      if (!accessToken) {
        clearAuthState();
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
        };
      }

      setAccessToken(accessToken);
      if (newRefreshToken) setRefreshToken(newRefreshToken);

      return { authenticated: true };
    } catch {
      clearAuthState();
      return { authenticated: false, redirectTo: "/login", logout: true };
    }
  },

  getIdentity: async () => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      const user = data.data || data;
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        avatar: user.avatarUrl,
      };
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if ((error as Record<string, unknown>)?.statusCode === 401) {
      clearAuthState();
      return { redirectTo: "/login", logout: true };
    }
    return {};
  },

  getPermissions: async () => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      const user = data.data || data;
      return user.role === "ADMIN" ? ["admin"] : [];
    } catch {
      return [];
    }
  },
};
