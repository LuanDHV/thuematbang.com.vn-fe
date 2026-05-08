export interface Post {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  content: string;
  viewCount: number | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    name: string;
    slug: string;
  };
}
