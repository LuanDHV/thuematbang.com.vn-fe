import type { ContentStatus } from "../enums/index.js";

export interface News {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  summary?: string | null;
  content?: string | null;
  isFeatured: boolean;
  status: ContentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}
