export interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  imagePublicId?: string | null;
  sortOrder: number;
  createdAt: Date | string;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string;
  imagePublicId?: string | null;
  sortOrder: number;
  createdAt: Date | string;
}
