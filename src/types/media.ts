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
