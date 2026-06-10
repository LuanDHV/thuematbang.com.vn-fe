import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(120, "Họ và tên không vượt quá 120 ký tự"),

  phone: z
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\-\s().]+$/, "Số điện thoại không hợp lệ"),

  email: z.string().email("Email không hợp lệ"),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
