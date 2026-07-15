export interface FaqItem {
  id: number;
  page: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FaqByPageResponse {
  page: string;
  items: FaqItem[];
}
