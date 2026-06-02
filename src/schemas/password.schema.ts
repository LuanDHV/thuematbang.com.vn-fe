import { z } from "zod";

const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

const STRONG_PASSWORD_MESSAGE =
  "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";

const strongPasswordSchema = z
  .string()
  .min(8, STRONG_PASSWORD_MESSAGE)
  .regex(PASSWORD_COMPLEXITY_REGEX, STRONG_PASSWORD_MESSAGE);

export const passwordFormSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu."),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp.",
      });
    }
  });

export const changePasswordPayloadSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại."),
  newPassword: strongPasswordSchema,
});

export const setPasswordPayloadSchema = z
  .object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu."),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Mật khẩu xác nhận không khớp.",
      });
    }
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
