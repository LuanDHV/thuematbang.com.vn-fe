import "server-only";

import { User } from "@/types";
import { requestServerApi } from "./shared/server-api-client";

export type UpdateMePayload = {
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
};

export type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type SetMyPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

type PasswordActionResponse = {
  message?: string;
};

type AuthenticatedRequestOptions = {
  mutateAuthCookies?: boolean;
};

function buildJsonBody(payload: UpdateMePayload) {
  return JSON.stringify(payload);
}

export const userService = {
  // Fetch the authenticated user snapshot used by auth-aware UI.
  me: async (options: AuthenticatedRequestOptions = {}) =>
    (
      await requestServerApi<User | null>("/users/me", {
        auth: "required",
        cache: "no-store",
        tags: ["auth-me"],
        mutateAuthCookies: options.mutateAuthCookies,
      })
    ).data,

  // Update the current user's profile, including avatar metadata when present.
  updateMe: async (
    payload: UpdateMePayload,
    options: AuthenticatedRequestOptions = {},
  ) => {
    const response = await requestServerApi<User>("/users/me", {
      method: "PATCH",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: buildJsonBody(payload),
      mutateAuthCookies: options.mutateAuthCookies,
    });
    return response.data;
  },

  // Change the current user's password when the old password is known.
  changeMyPassword: async (
    payload: ChangeMyPasswordPayload,
    options: AuthenticatedRequestOptions = {},
  ) => {
    const response = await requestServerApi<PasswordActionResponse>(
      "/users/me/password",
      {
        method: "PATCH",
        auth: "required",
        mutateAuthCookies: options.mutateAuthCookies,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },

  // Set the first password for accounts that do not yet have one.
  setMyPassword: async (
    payload: SetMyPasswordPayload,
    options: AuthenticatedRequestOptions = {},
  ) => {
    const response = await requestServerApi<PasswordActionResponse>(
      "/users/me/password/set",
      {
        method: "POST",
        auth: "required",
        mutateAuthCookies: options.mutateAuthCookies,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },
};
