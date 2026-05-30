export interface SeoContentEntry {
  id: number;
  page: string;
  seoContent?: string | null;
  faqTitle?: string | null;
  faqDescription?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
