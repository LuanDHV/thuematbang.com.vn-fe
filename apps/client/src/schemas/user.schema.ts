import { z } from "zod";

export const profilePhoneSchema = z
  .string()
  .trim()
  .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ");

export const profileFullNameSchema = z
  .string()
  .trim()
  .min(2, "Họ và tên phải có ít nhất 2 ký tự")
  .max(120, "Họ và tên không vượt quá 120 ký tự")
  .regex(/^[\p{L}\s'.-]+$/u, "Họ và tên không hợp lệ");

export const editProfileSchema = z.object({
  fullName: profileFullNameSchema,

  phone: profilePhoneSchema,

  email: z.string().email("Email không hợp lệ"),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
