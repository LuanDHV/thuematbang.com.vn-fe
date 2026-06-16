"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { bannersService } from "@/services/banners.service";
import { categoryService } from "@/services/category.service";
import { faqService } from "@/services/faq.service";
import { leadService } from "@/services/lead.service";
import { newsService } from "@/services/news.service";
import { projectService } from "@/services/project.service";
import { rentRequestService } from "@/services/rent-request.service";
import { seoContentService } from "@/services/seo-content.service";
import { propertyService } from "@/services/property.service";
import { userService } from "@/services/user.service";
import { USER_ROLE_VALUES } from "@/constants/enum-values";
import type {
  LeadStatus,
  PropertyDirection,
  PublishStatus,
  UserRole,
} from "@/types/enums";

function toPositiveId(id: string | number) {
  const parsedId = typeof id === "number" ? id : Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid id");
  }
  return parsedId;
}

function normalizeBooleanField(formData: FormData, fieldName: string) {
  const values = formData.getAll(fieldName);
  if (!values.length) return;

  const normalized = values.some((value) => {
    if (typeof value !== "string") return false;
    const lowered = value.toLowerCase().trim();
    return lowered === "true" || lowered === "on" || lowered === "1";
  });

  formData.set(fieldName, normalized ? "true" : "false");
}

function normalizeSlugField(
  formData: FormData,
  sourceField: string,
  targetField: string,
) {
  const sourceValue = String(formData.get(sourceField) ?? "").trim();
  const currentSlug = String(formData.get(targetField) ?? "").trim();
  if (currentSlug) return;

  formData.set(targetField, sourceValue);
}

function refreshCrudTags(tags: string[], paths: string[] = []) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
  for (const path of paths) {
    revalidatePath(path);
  }
}

// Category
export async function createCategoryAction(payload: {
  type: "PROPERTY" | "RENT_REQUEST" | "PROJECT" | "NEWS";
  name: string;
  slug: string;
  priority?: number;
  isActive?: boolean;
}) {
  const result = await categoryService.create(payload);
  refreshCrudTags(["categories"], ["/admin/quan-li-danh-muc"]);
  return result;
}

export async function updateCategoryAction(
  id: string | number,
  payload: Partial<{
    type: "PROPERTY" | "RENT_REQUEST" | "PROJECT" | "NEWS";
    name: string;
    slug: string;
    priority?: number;
    isActive?: boolean;
  }>,
) {
  const categoryId = toPositiveId(id);
  const result = await categoryService.update(categoryId, payload);
  refreshCrudTags(
    ["categories", "category-detail"],
    ["/admin/quan-li-danh-muc"],
  );
  return result;
}

export async function deleteCategoryAction(id: string | number) {
  const categoryId = toPositiveId(id);
  const result = await categoryService.remove(categoryId);
  refreshCrudTags(
    ["categories", "category-detail"],
    ["/admin/quan-li-danh-muc"],
  );
  return result;
}

// Banner
export async function createBannerAction(formData: FormData) {
  normalizeBooleanField(formData, "isActive");
  const result = await bannersService.create(formData);
  refreshCrudTags(["banners"], ["/admin/quan-li-banners"]);
  return result;
}

export async function updateBannerAction(
  id: string | number,
  formData: FormData,
) {
  const bannerId = toPositiveId(id);
  normalizeBooleanField(formData, "isActive");
  const result = await bannersService.update(bannerId, formData);
  refreshCrudTags(["banners", "banner-detail"], ["/admin/quan-li-banners"]);
  return result;
}

export async function deleteBannerAction(id: string | number) {
  const bannerId = toPositiveId(id);
  const result = await bannersService.remove(bannerId);
  refreshCrudTags(["banners", "banner-detail"], ["/admin/quan-li-banners"]);
  return result;
}

// FAQ
export async function createFaqAction(payload: {
  page: string;
  question: string;
  answer: string;
  sortOrder?: number;
}) {
  const result = await faqService.create(payload);
  refreshCrudTags(["faqs"], ["/admin/quan-li-faqs"]);
  return result;
}

export async function updateFaqAction(
  id: string | number,
  payload: Partial<{
    page: string;
    question: string;
    answer: string;
    sortOrder?: number;
  }>,
) {
  const faqId = toPositiveId(id);
  const result = await faqService.update(faqId, payload);
  refreshCrudTags(["faqs", "faq-detail"], ["/admin/quan-li-faqs"]);
  return result;
}

export async function deleteFaqAction(id: string | number) {
  const faqId = toPositiveId(id);
  const result = await faqService.remove(faqId);
  refreshCrudTags(["faqs", "faq-detail"], ["/admin/quan-li-faqs"]);
  return result;
}

// SEO content
export async function createSeoContentAction(payload: {
  page: string;
  seoContent?: string | null;
}) {
  const result = await seoContentService.create(payload);
  refreshCrudTags(["seo-contents"], ["/admin/quan-li-noi-dung-seo"]);
  return result;
}

export async function updateSeoContentAction(
  id: string | number,
  payload: Partial<{
    page: string;
    seoContent?: string | null;
  }>,
) {
  const seoContentId = toPositiveId(id);
  const result = await seoContentService.update(seoContentId, payload);
  refreshCrudTags(
    ["seo-contents", "seo-content-detail"],
    ["/admin/quan-li-noi-dung-seo"],
  );
  return result;
}

export async function deleteSeoContentAction(id: string | number) {
  const seoContentId = toPositiveId(id);
  const result = await seoContentService.remove(seoContentId);
  refreshCrudTags(
    ["seo-contents", "seo-content-detail"],
    ["/admin/quan-li-noi-dung-seo"],
  );
  return result;
}

// Lead
export async function createLeadAction(payload: {
  fullName: string;
  phone: string;
  message?: string;
  status?: LeadStatus | null;
  userId?: number | null;
  propertyId?: number | null;
}) {
  const result = await leadService.create(payload);
  refreshCrudTags(["leads"], ["/admin/quan-li-leads"]);
  return result;
}

export async function updateLeadAction(
  id: string | number,
  payload: Partial<{
    fullName: string;
    phone: string;
    message?: string;
    status?: LeadStatus | null;
    userId?: number | null;
    propertyId?: number | null;
  }>,
) {
  const leadId = toPositiveId(id);
  const result = await leadService.update(leadId, payload);
  refreshCrudTags(["leads", "lead-detail"], ["/admin/quan-li-leads"]);
  return result;
}

export async function deleteLeadAction(id: string | number) {
  const leadId = toPositiveId(id);
  const result = await leadService.remove(leadId);
  refreshCrudTags(["leads", "lead-detail"], ["/admin/quan-li-leads"]);
  return result;
}

// News
export async function createNewsAction(formData: FormData) {
  normalizeBooleanField(formData, "isFeatured");
  normalizeSlugField(formData, "title", "slug");
  const result = await newsService.create(formData);
  refreshCrudTags(["news"], ["/admin/quan-li-tin-tuc", "/tin-tuc"]);
  return result;
}

export async function updateNewsAction(
  id: string | number,
  formData: FormData,
) {
  const newsId = toPositiveId(id);
  normalizeBooleanField(formData, "isFeatured");
  normalizeSlugField(formData, "title", "slug");
  const result = await newsService.update(newsId, formData);
  refreshCrudTags(
    ["news", "news-detail"],
    ["/admin/quan-li-tin-tuc", "/tin-tuc"],
  );
  return result;
}

export async function deleteNewsAction(id: string | number) {
  const newsId = toPositiveId(id);
  const result = await newsService.remove(newsId);
  refreshCrudTags(
    ["news", "news-detail"],
    ["/admin/quan-li-tin-tuc", "/tin-tuc"],
  );
  return result;
}

// Project
export async function createProjectAction(formData: FormData) {
  normalizeBooleanField(formData, "isFeatured");
  normalizeSlugField(formData, "name", "slug");
  const result = await projectService.create(formData);
  refreshCrudTags(["projects"], ["/admin/quan-li-du-an", "/du-an"]);
  return result;
}

export async function updateProjectAction(
  id: string | number,
  formData: FormData,
) {
  const projectId = toPositiveId(id);
  normalizeBooleanField(formData, "isFeatured");
  normalizeSlugField(formData, "name", "slug");
  const result = await projectService.update(projectId, formData);
  refreshCrudTags(
    ["projects", "project-detail"],
    ["/admin/quan-li-du-an", "/du-an"],
  );
  return result;
}

export async function deleteProjectAction(id: string | number) {
  const projectId = toPositiveId(id);
  const result = await projectService.remove(projectId);
  refreshCrudTags(
    ["projects", "project-detail"],
    ["/admin/quan-li-du-an", "/du-an"],
  );
  return result;
}

// Rent request
export async function updateRentRequestAction(
  id: string | number,
  payload: FormData,
) {
  const rentRequestId = toPositiveId(id);
  normalizeSlugField(payload, "title", "slug");
  const userIdValue = Number(payload.get("userId"));
  const statusValue = String(payload.get("status") ?? "").trim();
  const isMatchedValue = String(payload.get("isMatched") ?? "").trim();
  const result = await rentRequestService.update(rentRequestId, {
    title: String(payload.get("title") ?? "").trim(),
    slug: String(payload.get("slug") ?? "").trim(),
    categoryId: Number(payload.get("categoryId")),
    budget: Number(payload.get("budget")),
    desiredArea: Number(payload.get("desiredArea")),
    bedrooms: Number.isFinite(Number(payload.get("bedrooms")))
      ? Number(payload.get("bedrooms"))
      : undefined,
    bathrooms: Number.isFinite(Number(payload.get("bathrooms")))
      ? Number(payload.get("bathrooms"))
      : undefined,
    floors: Number.isFinite(Number(payload.get("floors")))
      ? Number(payload.get("floors"))
      : undefined,
    desiredProvinceId: Number(payload.get("desiredProvinceId")),
    desiredWardId: Number(payload.get("desiredWardId")),
    contactName: String(payload.get("contactName") ?? "").trim(),
    contactPhone: String(payload.get("contactPhone") ?? "").trim(),
    requirementText:
      String(payload.get("requirementText") ?? "").trim() || undefined,
    userId: Number.isFinite(userIdValue) ? userIdValue : undefined,
    status: statusValue ? (statusValue as PublishStatus) : undefined,
    isMatched:
      isMatchedValue === "true" ||
      isMatchedValue === "on" ||
      isMatchedValue === "1",
    desiredDirection: String(payload.get("desiredDirection") ?? "").trim()
      ? (String(
          payload.get("desiredDirection") ?? "",
        ).trim() as PropertyDirection)
      : null,
  });
  refreshCrudTags(
    ["rent-requests", "rent-request-detail", "my-rent-requests"],
    ["/admin/quan-li-tin-can-thue", "/quan-li-tai-khoan/cau-thue"],
  );
  return result;
}

export async function deleteRentRequestAction(id: string | number) {
  const rentRequestId = toPositiveId(id);
  const result = await rentRequestService.remove(rentRequestId);
  refreshCrudTags(
    ["rent-requests", "rent-request-detail", "my-rent-requests"],
    ["/admin/quan-li-tin-can-thue", "/quan-li-tai-khoan/cau-thue"],
  );
  return result;
}

// Property
export async function deletePropertyAdminAction(id: string | number) {
  const propertyId = toPositiveId(id);
  const result = await propertyService.remove(propertyId);
  refreshCrudTags(
    ["properties", "property-detail", "my-properties"],
    ["/admin/quan-li-tin-cho-thue", "/quan-li-tai-khoan/cho-thue"],
  );
  return result;
}

// Admin user role
export async function updateUserRoleAction(
  id: string | number,
  formData: FormData,
) {
  const roleValue = String(formData.get("role") ?? "").trim();
  if (!USER_ROLE_VALUES.includes(roleValue as UserRole)) {
    throw new Error("Invalid user role");
  }

  await userService.updateAdminUserRole(toPositiveId(id), {
    role: roleValue as UserRole,
  });
  refreshCrudTags(["admin-users"], ["/admin/quan-li-tai-khoan"]);
}
