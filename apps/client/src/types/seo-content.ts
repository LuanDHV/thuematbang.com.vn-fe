export interface SeoContent {
  id: number;
  page: string;
  targetPath: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImageUrl?: string | null;
  metaImagePublicId?: string | null;
  seoContent?: string | null;
  isActive?: boolean;
  matchedPath?: string;
  resolvedFrom?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
