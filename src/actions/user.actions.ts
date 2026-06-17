"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { userService, type UpdateMePayload } from "@/services/user.service";
import { HttpError } from "@/lib/http";
import {
  changePasswordPayloadSchema,
  setPasswordPayloadSchema,
} from "@/schemas/password.schema";
import { editProfileSchema } from "@/schemas/user.schema";
import type {
  ChangeMyPasswordPayload,
  SetMyPasswordPayload,
} from "@/services/user.service";

export async function getCurrentUserAction() {
  try {
    return await userService.me({ mutateAuthCookies: true });
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function updateMyProfileAction(payload: UpdateMePayload) {
  const parsedProfile = editProfileSchema.parse({
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
  });

  const updatedUser = await userService.updateMe(
    {
      ...parsedProfile,
      avatarUrl: payload.avatarUrl,
      avatarPublicId: payload.avatarPublicId,
    },
    {
      mutateAuthCookies: true,
    },
  );

  revalidateTag("auth-me", "max");
  revalidatePath("/quan-li-tai-khoan");
  return updatedUser;
}

export async function changeMyPasswordAction(payload: ChangeMyPasswordPayload) {
  const parsedPayload = changePasswordPayloadSchema.parse(payload);
  const result = await userService.changeMyPassword(parsedPayload, {
    mutateAuthCookies: true,
  });
  revalidateTag("auth-me", "max");
  return result;
}

export async function setMyPasswordAction(payload: SetMyPasswordPayload) {
  const parsedPayload = setPasswordPayloadSchema.parse(payload);
  const result = await userService.setMyPassword(parsedPayload, {
    mutateAuthCookies: true,
  });
  revalidateTag("auth-me", "max");
  return result;
}
