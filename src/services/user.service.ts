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

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  filters?: Record<string, string | number | boolean | null | undefined>;
};

type PasswordActionResponse = {
  message?: string;
};

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
  me: async () =>
    (
      await requestServerApi<User | null>("/users/me", {
        auth: "required",
        cache: "no-store",
        tags: ["auth-me"],
      })
    ).data,

  getAdminUsers: async (params: AdminUserListParams = {}) =>
    requestServerApi<User[]>(buildListPath("/admin/users", params), {
      auth: "required",
      cache: "no-store",
      tags: buildListTags("admin-users", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  updateMe: async (payload: UpdateMePayload) => {
    const response = await requestServerApi<User>("/users/me", {
      method: "PATCH",
      auth: "required",
      body: buildProfileFormData(payload),
    });
    return response.data;
  },

  changeMyPassword: async (payload: ChangeMyPasswordPayload) => {
    const response = await requestServerApi<PasswordActionResponse>(
      "/users/me/password",
      {
        method: "PATCH",
        auth: "required",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },

  setMyPassword: async (payload: SetMyPasswordPayload) => {
    const response = await requestServerApi<PasswordActionResponse>(
      "/users/me/password/set",
      {
        method: "POST",
        auth: "required",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },
};
