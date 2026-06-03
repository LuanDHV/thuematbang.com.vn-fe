export interface SeoContent {
  id: number;
  page: string;
  seoContent?: string | null;
  faqTitle?: string | null;
  faqDescription?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
