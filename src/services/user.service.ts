import "server-only";

import { User } from "@/types";
import { buildListPath, buildListTags } from "./shared/list-service";
import { requestServerApi } from "./shared/server-api-client";

export type UpdateMePayload = {
  fullName: string;
  phone: string;
  email?: string;
  avatar?: File;
  avatarUrl?: string;
  avatarPublicId?: string;
};

export type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type SetMyPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

export type AdminUserListFilters = {
  q?: string;
};

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  filters?: AdminUserListFilters;
};

type PasswordActionResponse = {
  message?: string;
};

type AuthenticatedRequestOptions = {
  mutateAuthCookies?: boolean;
};

// Build the multipart payload expected by the profile update endpoint.
function buildProfileFormData(payload: UpdateMePayload) {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("phone", payload.phone);

  if (payload.email) {
    formData.append("email", payload.email);
  }
  if (payload.avatar) {
    formData.append("avatar", payload.avatar);
  }
  if (payload.avatarUrl) {
    formData.append("avatarUrl", payload.avatarUrl);
  }
  if (payload.avatarPublicId) {
    formData.append("avatarPublicId", payload.avatarPublicId);
  }

  return formData;
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

  // Fetch paginated admin users for CMS user-management tables.
  getAdminUsers: async (
    params: AdminUserListParams = {},
    options: AuthenticatedRequestOptions = {},
  ) =>
    requestServerApi<User[]>(buildListPath("/admin/users", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("admin-users", {
        page: params.page,
        limit: params.limit,
      }),
      mutateAuthCookies: options.mutateAuthCookies,
    }),

  // Update the current user's profile, including avatar metadata when present.
  updateMe: async (
    payload: UpdateMePayload,
    options: AuthenticatedRequestOptions = {},
  ) => {
    const response = await requestServerApi<User>("/users/me", {
      method: "PATCH",
      auth: "required",
      body: buildProfileFormData(payload),
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
