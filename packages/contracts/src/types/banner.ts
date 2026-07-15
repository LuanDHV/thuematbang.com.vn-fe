export interface Banner {
  id: number;
  title: string;
  page: string;
  position: string;
  imageUrl: string;
  imagePublicId?: string | null;
  targetLink?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
