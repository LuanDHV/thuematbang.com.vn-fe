export interface Post {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  summary?: string | null;
  content?: string | null;
  viewCount?: number | null;
  status?: string | null;
  isFeatured?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}
