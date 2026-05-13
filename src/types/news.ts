import { Category } from "./category";
import { PublishStatus } from "./enums";

export interface News {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  summary?: string | null;
  content?: string | null;
  viewCount?: number | null;
  status?: PublishStatus | string | null;
  isFeatured?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  category?: Category | null;
}
