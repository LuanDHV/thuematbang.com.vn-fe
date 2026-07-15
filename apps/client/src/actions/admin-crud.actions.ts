"use server";

import { bannersService } from "@/services/banners.service";
import { categoryService } from "@/services/category.service";
import { faqService } from "@/services/faq.service";
import { leadService } from "@/services/lead.service";
import { newsService } from "@/services/news.service";
import { projectService } from "@/services/project.service";
import { rentRequestService } from "@/services/rent-request.service";
import { seoContentService } from "@/services/seo-content.service";
import { staticPageService } from "@/services/static-page.service";
import { propertyService } from "@/services/property.service";
import { userService } from "@/services/user.service";
import { USER_ROLE_VALUES } from "@/constants/enum-values";
import { toPositiveId } from "@/lib/form/form-normalize";
import { refreshCrudTags } from "@/lib/server/revalidate";
import type { CategoryType, LeadStatus, UserRole } from "@/types/enums";
import type { BannerUpsertPayload } from "@/services/banners.service";
import type { NewsUpsertPayload } from "@/services/news.service";
import type { ProjectUpsertPayload } from "@/services/project.service";
import type { RentRequestUpsertPayload } from "@/services/rent-request.service";
import type { StaticPageUpsertPayload } from "@/services/static-page.service";

// Category
export async function createCategoryAction(payload: {
  type: CategoryType;
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
    type: CategoryType;
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
export async function createBannerAction(payload: BannerUpsertPayload) {
  const result = await bannersService.create(payload);
  refreshCrudTags(["banners"], ["/admin/quan-li-banners"]);
  return result;
}

export async function updateBannerAction(
  id: string | number,
  payload: BannerUpsertPayload,
) {
  const bannerId = toPositiveId(id);
  const result = await bannersService.update(bannerId, payload);
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

// Static page
export async function createStaticPageAction(payload: StaticPageUpsertPayload) {
  const result = await staticPageService.create(payload);
  refreshCrudTags(
    ["static-pages"],
    ["/admin/quan-li-trang-tinh", `/${result.siteCode}`],
  );
  return result;
}

export async function updateStaticPageAction(
  id: string | number,
  payload: Partial<StaticPageUpsertPayload>,
) {
  const staticPageId = toPositiveId(id);
  const current = await staticPageService.getById(staticPageId);
  const result = await staticPageService.update(staticPageId, payload);
  refreshCrudTags(
    ["static-pages", "static-page-detail"],
    ["/admin/quan-li-trang-tinh", `/${current.siteCode}`, `/${result.siteCode}`],
  );
  return result;
}

export async function deleteStaticPageAction(id: string | number) {
  const staticPageId = toPositiveId(id);
  const current = await staticPageService.getById(staticPageId);
  const result = await staticPageService.remove(staticPageId);
  refreshCrudTags(
    ["static-pages", "static-page-detail"],
    ["/admin/quan-li-trang-tinh", `/${current.siteCode}`],
  );
  return result;
}

// Lead
export async function createLeadAction(payload: {
  fullName: string;
  phone: string;
  status?: LeadStatus | null;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
}) {
  const result = await leadService.create(payload);
  refreshCrudTags(
    ["leads"],
    ["/admin/quan-li-leads/cho-thue", "/admin/quan-li-leads/can-thue"],
  );
  return result;
}

export async function updateLeadAction(
  id: string | number,
  payload: Partial<{
    fullName: string;
    phone: string;
    status?: LeadStatus | null;
    userId?: number | null;
    propertyId?: number | null;
    rentRequestId?: number | null;
    candidateId?: number | null;
  }>,
) {
  const leadId = toPositiveId(id);
  const result = await leadService.update(leadId, payload);
  refreshCrudTags(
    ["leads", "lead-detail"],
    ["/admin/quan-li-leads/cho-thue", "/admin/quan-li-leads/can-thue"],
  );
  return result;
}

export async function deleteLeadAction(id: string | number) {
  const leadId = toPositiveId(id);
  const result = await leadService.remove(leadId);
  refreshCrudTags(
    ["leads", "lead-detail"],
    ["/admin/quan-li-leads/cho-thue", "/admin/quan-li-leads/can-thue"],
  );
  return result;
}

// News
export async function createNewsAction(payload: NewsUpsertPayload) {
  const result = await newsService.create(payload);
  refreshCrudTags(["news"], ["/admin/quan-li-tin-tuc", "/tin-tuc"]);
  return result;
}

export async function updateNewsAction(
  id: string | number,
  payload: NewsUpsertPayload,
) {
  const newsId = toPositiveId(id);
  const result = await newsService.update(newsId, payload);
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
export async function createProjectAction(payload: ProjectUpsertPayload) {
  const result = await projectService.create(payload);
  refreshCrudTags(["projects"], ["/admin/quan-li-du-an", "/du-an"]);
  return result;
}

export async function updateProjectAction(
  id: string | number,
  payload: ProjectUpsertPayload,
) {
  const projectId = toPositiveId(id);
  const result = await projectService.update(projectId, payload);
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
  payload: Partial<RentRequestUpsertPayload>,
) {
  const rentRequestId = toPositiveId(id);
  const result = await rentRequestService.update(rentRequestId, payload);
  refreshCrudTags(
    ["rent-requests", "rent-request-detail", "my-rent-requests"],
    ["/admin/quan-li-tin-can-thue", "/quan-li-tai-khoan/can-thue"],
  );
  return result;
}

export async function deleteRentRequestAction(id: string | number) {
  const rentRequestId = toPositiveId(id);
  const result = await rentRequestService.remove(rentRequestId);
  refreshCrudTags(
    ["rent-requests", "rent-request-detail", "my-rent-requests"],
    ["/admin/quan-li-tin-can-thue", "/quan-li-tai-khoan/can-thue"],
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
