import { z } from "zod";

// Validation schema for editing profile form data
export const editProfileSchema = z.object({
  // Full name field validation
  fullName: z
    .string()
    .trim()
    .min(12, "Họ và tên phải có ít nhất 12 ký tự")
    .max(120, "Họ và tên không vượt quá 120 ký tự"),

  // Phone number field validation with format regex
  phone: z
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\-\s().]+$/, "Số điện thoại không hợp lệ"),

  // Email field validation
  email: z.string().email("Email không hợp lệ"),
});

// Infer TypeScript types directly from the Zod schema
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
