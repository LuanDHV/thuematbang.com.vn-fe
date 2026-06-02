'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { userService } from "@/services/user.service";
import { changePasswordPayloadSchema, setPasswordPayloadSchema } from "@/schemas/password.schema";
import { editProfileSchema } from "@/schemas/user.schema";
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
  const profileInput = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: toOptionalString(formData.get("email")),
  };
  const parsedProfile = editProfileSchema.parse(profileInput);

  const payload: UpdateMePayload = {
    ...parsedProfile,
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
  const parsedPayload = changePasswordPayloadSchema.parse(payload);
  const result = await userService.changeMyPassword(parsedPayload);
  revalidateTag("auth-me", "max");
  return result;
}

export async function setMyPasswordAction(payload: SetMyPasswordPayload) {
  const parsedPayload = setPasswordPayloadSchema.parse(payload);
  const result = await userService.setMyPassword(parsedPayload);
  revalidateTag("auth-me", "max");
  return result;
}
