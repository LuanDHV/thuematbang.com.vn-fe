export interface FaqItem {
  id: number;
  page: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FaqByPageResponse {
  page: string;
  faqs: FaqItem[];
}
