export interface PropertyImage {
  id: number;
  propertyId: number;
  fileUrl: string;
  publicId?: string | null;
  sortOrder: number;
  createdAt: Date | string;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  fileUrl: string;
  publicId?: string | null;
  sortOrder: number;
  createdAt: Date | string;
}
