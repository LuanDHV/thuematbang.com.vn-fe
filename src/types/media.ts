export interface Media {
  id: number;
  fileUrl: string;
  // Legacy generic fields.
  mediableId?: number;
  mediaType?: string;
  // Schema-specific fields.
  propertyId?: number;
  projectId?: number;
  sortOrder?: number | null;
  createdAt?: Date | string | null;
}

export interface PropertyImage extends Media {
  propertyId: number;
  publicId?: string | null;
  sortOrder?: number | null;
}

export interface ProjectImage extends Media {
  projectId: number;
  publicId?: string | null;
  sortOrder?: number | null;
}
