import { User } from "@/types";
import { buildListPath, buildListTags } from "./shared/list-service";
import { getApiResponse } from "./shared/api-client";
import { getPrivateApiResponse } from "./shared/private-api-client";

// Define TypeScript types for updating user profile payload
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

export type AdminUserListRequestOptions = {
  accessToken: string;
};

type PasswordActionResponse = {
  message?: string;
};

function extractApiMessage(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const record = payload as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim().length > 0) {
    return record.message;
  }

  const nestedError = record.error;
  if (nestedError && typeof nestedError === "object") {
    const nestedRecord = nestedError as Record<string, unknown>;
    if (
      typeof nestedRecord.message === "string" &&
      nestedRecord.message.trim().length > 0
    ) {
      return nestedRecord.message;
    }
  }

  return undefined;
}

async function submitPasswordAction(
  url: string,
  method: "PATCH" | "POST",
  payload: ChangeMyPasswordPayload | SetMyPasswordPayload,
) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(extractApiMessage(data) || "Không thể cập nhật mật khẩu");
  }

  return (data?.data ?? data) as PasswordActionResponse;
}

// Service object containing user-related API calls
export const userService = {
  // Fetch the current authenticated user details
  me: async () =>
    (
      await getApiResponse<User | null>("/users/me", {
        cache: "no-store",
        tags: ["auth-me"],
      })
    ).data,

  getAdminUsers: async (
    params: AdminUserListParams = {},
    requestOptions?: AdminUserListRequestOptions,
  ) =>
    getPrivateApiResponse<User[]>(buildListPath("/admin/users", params), {
      accessToken: requestOptions?.accessToken ?? "",
      cache: "no-store",
      tags: buildListTags("admin-users", {
        page: params.page,
        limit: params.limit,
      }),
    }),

  // Method to update user profile using multipart FormData via PATCH request
  updateMe: async (payload: UpdateMePayload) => {
    const formData = new FormData();
    formData.append("fullName", payload.fullName);
    formData.append("phone", payload.phone);

    // Append optional fields to FormData if they exist
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

    // Call Next.js PATCH API route
    const response = await fetch("/api/v1/users/me", {
      method: "PATCH",
      body: formData,
    });

    // Parse response body, return null if parsing fails
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.message || "Không thể cập nhật thông tin tài khoản",
      );
    }

    return (data?.data ?? data) as User;
  },

  changeMyPassword: (payload: ChangeMyPasswordPayload) =>
    submitPasswordAction("/api/v1/users/me/password", "PATCH", payload),

  setMyPassword: (payload: SetMyPasswordPayload) =>
    submitPasswordAction("/api/v1/users/me/password/set", "POST", payload),
};
