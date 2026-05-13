export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  targetLink?: string | null;
  position: string;
  sortOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
}
