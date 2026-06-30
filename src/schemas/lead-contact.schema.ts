import { z } from "zod";

const phoneSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    return value.replace(/\s+/g, "");
  },
  z
    .string()
    .min(9, "Vui lòng nhập số điện thoại hợp lệ")
    .max(20, "Số điện thoại không vượt quá 20 ký tự")
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
);

export const leadContactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên hợp lệ")
    .max(255, "Họ và tên không vượt quá 255 ký tự"),
  phone: phoneSchema,
});

export type LeadContactFormValues = z.infer<typeof leadContactSchema>;
