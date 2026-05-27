import { User } from "@/types";
import { getApiResponse } from "./shared/api-client";

// Define TypeScript types for updating user profile payload
export type UpdateMePayload = {
  fullName: string;
  phone: string;
  email?: string;
  avatar?: File;
  avatarUrl?: string;
  avatarPublicId?: string;
};

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
};
