export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  targetLink?: string | null;
  position: string;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
}
