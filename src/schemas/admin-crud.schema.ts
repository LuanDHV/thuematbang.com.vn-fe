import { z } from "zod";

import {
  CATEGORY_TYPE_VALUES,
  LEAD_STATUS_VALUES,
  PAGE_VALUES,
  PRICE_UNIT_VALUES,
  PUBLISH_STATUS_VALUES,
} from "@/constants/enum-values";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập slug")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ");

const optionalTextSchema = z.string().trim().max(10_000).optional();

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

const requiredIntegerSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().int().positive());

const requiredNumberSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}, z.number().nonnegative());

export const categoryFormSchema = z.object({
  type: z.enum(CATEGORY_TYPE_VALUES),
  name: z.string().trim().min(2).max(255),
  slug: slugSchema,
  priority: optionalIntegerSchema,
  isActive: z.boolean().default(true),
});

export const bannerFormSchema = z.object({
  title: z.string().trim().min(2).max(255),
  targetLink: optionalTextSchema,
  page: z.enum(PAGE_VALUES).optional(),
  position: z.string().trim().min(1).max(120),
  sortOrder: optionalIntegerSchema,
  isActive: z.boolean().default(true),
});

export const faqFormSchema = z.object({
  page: z.enum(PAGE_VALUES),
  question: z.string().trim().min(2).max(1000),
  answer: z.string().trim().min(2).max(10_000),
  sortOrder: optionalIntegerSchema,
});

export const seoContentFormSchema = z.object({
  page: z.enum(PAGE_VALUES),
  seoContent: optionalTextSchema,
});

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(9).max(20),
  message: optionalTextSchema,
  status: z.enum(LEAD_STATUS_VALUES).nullable().optional(),
  userId: optionalIntegerSchema,
  propertyId: optionalIntegerSchema,
});

export const newsFormSchema = z.object({
  categoryId: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : value;
  }, z.number().int().positive()),
  title: z.string().trim().min(2).max(255),
  slug: slugSchema,
  summary: optionalTextSchema,
  content: optionalTextSchema,
  status: z.enum(PUBLISH_STATUS_VALUES).nullable().optional(),
  isFeatured: z.boolean().default(false).optional(),
});

export const projectFormSchema = z.object({
  name: z.string().trim().min(2).max(255),
  slug: slugSchema,
  categoryId: z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : value;
  }, z.number().int().positive()),
  developer: optionalTextSchema,
  provinceId: requiredIntegerSchema,
  wardId: requiredIntegerSchema,
  addressDetail: optionalTextSchema,
  longitude: optionalNumberSchema,
  latitude: optionalNumberSchema,
  area: requiredNumberSchema,
  priceAmount: requiredNumberSchema,
  priceUnit: z.enum(PRICE_UNIT_VALUES),
  price: optionalNumberSchema,
  content: optionalTextSchema,
  status: z.enum(PUBLISH_STATUS_VALUES).nullable().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type BannerFormValues = z.infer<typeof bannerFormSchema>;
export type FaqFormValues = z.infer<typeof faqFormSchema>;
export type SeoContentFormValues = z.infer<typeof seoContentFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;
export type NewsFormValues = z.infer<typeof newsFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
