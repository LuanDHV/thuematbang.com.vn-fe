export interface StaticPage {
  id: number;
  siteCode: string;
  content: string;
  isPublished: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
