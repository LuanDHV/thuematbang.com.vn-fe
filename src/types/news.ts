import { Category } from "./category";
import { PublishStatus } from "./enums";

export interface News {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
  summary?: string | null;
  content?: string | null;
  viewCount: number;
  status: PublishStatus;
  isFeatured: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category | null;
}

