export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  targetLink?: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date | string;
}
