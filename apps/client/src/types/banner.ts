export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  imagePublicId?: string | null;
  targetLink?: string | null;
  page: string;
  position: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
}
