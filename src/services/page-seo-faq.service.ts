import "server-only";

import { FaqByPageResponse } from "@/types/faq";
import { SeoContentEntry } from "@/types/seo-content";
import { requestServerApi } from "./shared/server-api-client";

export type PageSeoFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type PageSeoFaqData = {
  seoContent: string;
  faqTitle: string;
  faqDescription: string;
  faqs: PageSeoFaqItem[];
};

const DEFAULT_PAGE_SEO_FAQ: PageSeoFaqData = {
  seoContent: "",
  faqTitle: "",
  faqDescription: "",
  faqs: [],
};

export const pageSeoFaqService = {
  getPageSeoFaq: async (page: string): Promise<PageSeoFaqData> => {
    const [seoRes, faqRes] = await Promise.all([
      requestServerApi<SeoContentEntry>(
        `/seo-contents/page/${encodeURIComponent(page)}`,
        {
          cache: "no-store",
          tags: ["seo-contents", `seo-contents-${page}`],
        },
      ),
      requestServerApi<FaqByPageResponse>(
        `/faqs/page/${encodeURIComponent(page)}`,
        {
          cache: "no-store",
          tags: ["faqs", `faqs-${page}`],
        },
      ),
    ]);

    const seoData = seoRes.data;
    const faqData = faqRes.data;

    return {
      seoContent: seoData?.seoContent ?? DEFAULT_PAGE_SEO_FAQ.seoContent,
      faqTitle: seoData?.faqTitle ?? DEFAULT_PAGE_SEO_FAQ.faqTitle,
      faqDescription:
        seoData?.faqDescription ?? DEFAULT_PAGE_SEO_FAQ.faqDescription,
      faqs:
        faqData?.faqs?.map((item) => ({
          id: String(item.id),
          question: item.question,
          answer: item.answer,
        })) ?? DEFAULT_PAGE_SEO_FAQ.faqs,
    };
  },
};
