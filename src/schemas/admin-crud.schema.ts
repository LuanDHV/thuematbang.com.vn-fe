import { z } from "zod";

import {
  CATEGORY_TYPE_VALUES,
  LEAD_STATUS_VALUES,
  PAGE_VALUES,
  PRICE_UNIT_VALUES,
  CONTENT_STATUS_VALUES,
} from "@/constants/enum-values";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập slug")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ");

const optionalTextSchema = z.string().trim().optional();

const optionalIntegerSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().int().nonnegative().optional());

const optionalNumberSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().optional());

function requiredIntegerSchema({
  requiredMessage,
  invalidMessage,
  positiveMessage,
}: {
  requiredMessage: string;
  invalidMessage: string;
  positiveMessage: string;
}) {
  return z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : value;
    },
    z
      .number({ error: requiredMessage })
      .int(invalidMessage)
      .positive(positiveMessage),
  );
}

function requiredNumberSchema({
  requiredMessage,
  invalidMessage,
  nonnegativeMessage,
}: {
  requiredMessage: string;
  invalidMessage: string;
  nonnegativeMessage: string;
}) {
  return z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      const numericValue = Number(value);
      return Number.isFinite(numericValue) ? numericValue : value;
    },
    z
      .number({ error: requiredMessage })
      .nonnegative(nonnegativeMessage ?? invalidMessage),
  );
}

export const categoryFormSchema = z.object({
  type: z.enum(CATEGORY_TYPE_VALUES, {
    message: "Vui lòng chọn loại danh mục",
  }),
  name: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tên danh mục hợp lệ")
    .max(255, "Tên danh mục không vượt quá 255 ký tự"),
  slug: slugSchema,
  priority: optionalIntegerSchema,
  isActive: z.boolean().default(true),
});

export const bannerFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tiêu đề hợp lệ")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  targetLink: optionalTextSchema,
  page: z
    .enum(PAGE_VALUES, {
      message: "Vui lòng chọn trang",
    })
    .optional(),
  position: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập vị trí banner")
    .max(120, "Vị trí banner không vượt quá 120 ký tự"),
  sortOrder: optionalIntegerSchema,
  isActive: z.boolean().default(true),
});

export const faqFormSchema = z.object({
  page: z.enum(PAGE_VALUES, {
    message: "Vui lòng chọn trang",
  }),
  question: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập câu hỏi hợp lệ")
    .max(1000, "Câu hỏi không vượt quá 1000 ký tự"),
  answer: z.string().trim().min(2, "Vui lòng nhập câu trả lời hợp lệ"),
  sortOrder: optionalIntegerSchema,
});

export const seoContentFormSchema = z.object({
  page: z.enum(PAGE_VALUES, {
    message: "Vui lòng chọn trang",
  }),
  seoContent: optionalTextSchema,
});

export const leadFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên hợp lệ")
    .max(255, "Họ và tên không vượt quá 255 ký tự"),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  status: z
    .enum(LEAD_STATUS_VALUES, {
      message: "Vui lòng chọn trạng thái",
    })
    .nullable()
    .optional(),
  userId: optionalIntegerSchema,
  propertyId: optionalIntegerSchema,
  rentRequestId: optionalIntegerSchema,
});

export const newsFormSchema = z.object({
  categoryId: requiredIntegerSchema({
    requiredMessage: "Vui lòng chọn danh mục",
    invalidMessage: "Danh mục không hợp lệ",
    positiveMessage: "Vui lòng chọn danh mục",
  }),
  title: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tiêu đề hợp lệ")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  slug: slugSchema,
  summary: optionalTextSchema,
  content: optionalTextSchema,
  status: z
    .enum(CONTENT_STATUS_VALUES, {
      message: "Vui lòng chọn trạng thái",
    })
    .nullable()
    .optional(),
  isFeatured: z.boolean().default(false).optional(),
});

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Vui lòng nhập tên dự án hợp lệ")
      .max(255, "Tên dự án không vượt quá 255 ký tự"),
    slug: slugSchema,
    categoryId: requiredIntegerSchema({
      requiredMessage: "Vui lòng chọn danh mục",
      invalidMessage: "Danh mục không hợp lệ",
      positiveMessage: "Vui lòng chọn danh mục",
    }),
    developer: optionalTextSchema,
    provinceId: requiredIntegerSchema({
      requiredMessage: "Vui lòng chọn tỉnh/thành",
      invalidMessage: "Khu vực không hợp lệ",
      positiveMessage: "Vui lòng chọn tỉnh/thành",
    }),
    wardId: optionalIntegerSchema,
    addressDetail: optionalTextSchema,
    longitude: optionalNumberSchema,
    latitude: optionalNumberSchema,
    area: requiredNumberSchema({
      requiredMessage: "Vui lòng nhập diện tích",
      invalidMessage: "Diện tích không hợp lệ",
      nonnegativeMessage: "Vui lòng nhập diện tích hợp lệ",
    }),
    priceAmount: optionalNumberSchema,
    priceUnit: z
      .enum(PRICE_UNIT_VALUES, {
        message: "Vui lòng chọn đơn vị giá",
      })
      .optional(),
    price: optionalNumberSchema,
    isNegotiable: z.boolean().default(false),
    content: optionalTextSchema,
    status: z
      .enum(CONTENT_STATUS_VALUES, {
        message: "Vui lòng chọn trạng thái",
      })
      .nullable()
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (value.isNegotiable) {
      return;
    }

    if (typeof value.priceAmount !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceAmount"],
        message: "Vui lòng nhập giá",
      });
    } else if (value.priceAmount < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceAmount"],
        message: "Vui lòng nhập giá hợp lệ",
      });
    }

    if (!value.priceUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceUnit"],
        message: "Vui lòng chọn đơn vị giá",
      });
    }
  });

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
export type FaqFormValues = z.infer<typeof faqFormSchema>;
export type SeoContentFormValues = z.infer<typeof seoContentFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type NewsFormValues = z.infer<typeof newsFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
