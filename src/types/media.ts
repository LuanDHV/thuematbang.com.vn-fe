export interface Media {
  id: number;
  mediableId: number;
  mediaType: string;
  fileUrl: string;
  isThumbnail?: boolean | null;
  sortOrder?: number | null;
  createdAt?: Date | string | null;
}
