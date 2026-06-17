import { z } from "zod";

import {
  PROPERTY_DIRECTION_VALUES,
  PROPERTY_PRIORITY_VALUES,
  PRICE_UNIT_VALUES,
  PUBLISH_SOURCE_VALUES,
  PUBLISH_STATUS_VALUES,
  RENT_REQUEST_STATUS_VALUES,
} from "@/constants/enum-values";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập slug")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
  );

const optionalTextSchema = z.string().trim().max(10_000).optional();

const nullableDirectionSchema = z
  .enum(PROPERTY_DIRECTION_VALUES, {
    message: "Vui lòng chọn hướng hợp lệ",
  })
  .nullable();

const optionalNumberSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().optional());

const optionalIntegerSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().int().nonnegative().optional());

function requiredNumberSchema({
  requiredMessage,
  invalidMessage,
  positiveMessage,
  integer = false,
  max,
  maxMessage,
}: {
  requiredMessage: string;
  invalidMessage: string;
  positiveMessage: string;
  integer?: boolean;
  max?: number;
  maxMessage?: string;
}) {
  const numberSchema = integer
    ? z
        .number({
          error: requiredMessage,
        })
        .int(invalidMessage)
    : z.number({
        error: requiredMessage,
      });

  let schema = numberSchema.positive(positiveMessage);

  if (typeof max === "number") {
    schema = schema.max(max, maxMessage ?? positiveMessage);
  }

  return z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : value;
  }, schema);
}

export const propertyCreateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tiêu đề hợp lệ")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  slug: slugSchema,
  categoryId: requiredNumberSchema({
    requiredMessage: "Vui lòng chọn danh mục",
    invalidMessage: "Danh mục không hợp lệ",
    positiveMessage: "Vui lòng chọn danh mục",
    integer: true,
  }),
  priceAmount: requiredNumberSchema({
    requiredMessage: "Vui lòng nhập giá",
    invalidMessage: "Giá không hợp lệ",
    positiveMessage: "Vui lòng nhập giá hợp lệ",
    max: Number.MAX_SAFE_INTEGER,
    maxMessage: "Giá không hợp lệ",
  }),
  priceUnit: z.enum(PRICE_UNIT_VALUES, {
    message: "Vui lòng chọn đơn vị giá",
  }),
  price: optionalNumberSchema,
  isNegotiable: z.boolean().default(false),
  area: requiredNumberSchema({
    requiredMessage: "Vui lòng nhập diện tích",
    invalidMessage: "Diện tích không hợp lệ",
    positiveMessage: "Vui lòng nhập diện tích hợp lệ",
    max: Number.MAX_SAFE_INTEGER,
    maxMessage: "Diện tích không hợp lệ",
  }),
  bedrooms: optionalIntegerSchema,
  bathrooms: optionalIntegerSchema,
  floors: optionalIntegerSchema,
  direction: nullableDirectionSchema,
  provinceId: requiredNumberSchema({
    requiredMessage: "Vui lòng chọn tỉnh/thành",
    invalidMessage: "Khu vực không hợp lệ",
    positiveMessage: "Vui lòng chọn tỉnh/thành",
    integer: true,
  }),
  wardId: optionalIntegerSchema,
  contactName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên hợp lệ")
    .max(255, "Họ và tên không vượt quá 255 ký tự"),
  contactPhone: z
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ")
    .max(20, "Số điện thoại không hợp lệ"),
  addressDetail: optionalTextSchema,
  longitude: optionalNumberSchema,
  latitude: optionalNumberSchema,
  content: optionalTextSchema,
  priorityStatus: z.enum(PROPERTY_PRIORITY_VALUES).nullable().optional(),
  publishSource: z.enum(PUBLISH_SOURCE_VALUES).nullable().optional(),
  isBoosted: z.boolean().default(false).optional(),
  boostCount: optionalIntegerSchema,
  status: z.enum(PUBLISH_STATUS_VALUES).nullable().optional(),
  isFeatured: z.boolean().default(false).optional(),
  userId: optionalIntegerSchema,
});

export const rentRequestCreateFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập tiêu đề hợp lệ")
    .max(255, "Tiêu đề không vượt quá 255 ký tự"),
  slug: slugSchema,
  categoryId: requiredNumberSchema({
    requiredMessage: "Vui lòng chọn danh mục",
    invalidMessage: "Danh mục không hợp lệ",
    positiveMessage: "Vui lòng chọn danh mục",
    integer: true,
  }),
  budgetAmount: requiredNumberSchema({
    requiredMessage: "Vui lòng nhập ngân sách",
    invalidMessage: "Ngân sách không hợp lệ",
    positiveMessage: "Vui lòng nhập ngân sách hợp lệ",
    max: Number.MAX_SAFE_INTEGER,
    maxMessage: "Ngân sách không hợp lệ",
  }),
  budgetUnit: z.enum(PRICE_UNIT_VALUES, {
    message: "Vui lòng chọn đơn vị giá",
  }),
  budget: optionalNumberSchema,
  desiredArea: requiredNumberSchema({
    requiredMessage: "Vui lòng nhập diện tích mong muốn",
    invalidMessage: "Diện tích không hợp lệ",
    positiveMessage: "Vui lòng nhập diện tích mong muốn hợp lệ",
    max: Number.MAX_SAFE_INTEGER,
    maxMessage: "Diện tích không hợp lệ",
  }),
  bedrooms: optionalIntegerSchema,
  bathrooms: optionalIntegerSchema,
  floors: optionalIntegerSchema,
  desiredDirection: nullableDirectionSchema,
  desiredProvinceId: requiredNumberSchema({
    requiredMessage: "Vui lòng chọn tỉnh/thành",
    invalidMessage: "Khu vực không hợp lệ",
    positiveMessage: "Vui lòng chọn tỉnh/thành",
    integer: true,
  }),
  desiredWardId: optionalIntegerSchema,
  contactName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên hợp lệ")
    .max(255, "Họ và tên không vượt quá 255 ký tự"),
  contactPhone: z
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ")
    .max(20, "Số điện thoại không hợp lệ"),
  requirementText: optionalTextSchema,
  userId: optionalIntegerSchema,
  status: z.enum(RENT_REQUEST_STATUS_VALUES).nullable().optional(),
  isMatched: z.boolean().default(false).optional(),
});

export type PropertyCreateFormValues = z.infer<
  typeof propertyCreateFormSchema
>;
export type RentRequestCreateFormValues = z.infer<
  typeof rentRequestCreateFormSchema
>;

