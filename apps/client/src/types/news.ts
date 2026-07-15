import { Category } from "./category";
import { ContentStatus } from "./enums";

export interface News {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  summary?: string | null;
  content?: string | null;
  viewCount: number;
  status: ContentStatus;
  isFeatured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category | null;
}
