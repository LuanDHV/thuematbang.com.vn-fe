import { z } from "zod";

// Regex for uppercase, lowercase, number, and special character
const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

// Common password validation schema
const passwordSchema = z
  .string({ message: "Mật khẩu phải là chuỗi ký tự" })
  .min(1, "Vui lòng nhập mật khẩu")
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(
    PASSWORD_COMPLEXITY_REGEX,
    "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  );

// Login validation schema
export const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: passwordSchema,
});

// Register validation schema
export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Vui lòng nhập họ và tên hợp lệ"),
    email: z.string().email("Định dạng email không hợp lệ"),
    phone: z.string().min(9, "Số điện thoại không hợp lệ"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  // Check if passwords match
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

// Extract TypeScript types from Zod schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
