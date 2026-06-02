'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { userService } from "@/services/user.service";
import type {
  ChangeMyPasswordPayload,
  SetMyPasswordPayload,
  UpdateMePayload,
} from "@/services/user.service";

function toOptionalString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function toOptionalFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 ? value : undefined;
}

export async function getCurrentUserAction() {
  return userService.me();
}

export async function updateMyProfileAction(formData: FormData) {
  const payload: UpdateMePayload = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: toOptionalString(formData.get("email")),
    avatar: toOptionalFile(formData.get("avatar")),
  };

  const updatedUser = await userService.updateMe(payload);
  revalidateTag("auth-me", "max");
  revalidatePath("/quan-li-tai-khoan");
  return updatedUser;
}

export async function changeMyPasswordAction(
  payload: ChangeMyPasswordPayload,
) {
  const result = await userService.changeMyPassword(payload);
  revalidateTag("auth-me", "max");
  return result;
}

export async function setMyPasswordAction(payload: SetMyPasswordPayload) {
  const result = await userService.setMyPassword(payload);
  revalidateTag("auth-me", "max");
  return result;
}
