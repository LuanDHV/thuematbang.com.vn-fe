export interface StaticPage {
  id: number;
  siteCode: string;
  content?: string | null;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
