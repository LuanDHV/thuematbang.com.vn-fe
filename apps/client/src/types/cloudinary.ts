export type CloudinaryUploadResourceType =
  | "news"
  | "properties"
  | "projects"
  | "banners"
  | "users"
  | "rent-requests";

export type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  uploadUrl: string;
};

export type UploadedCloudinaryImage = {
  imageUrl: string;
  imagePublicId: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
};

export type CloudinaryUploadState = "pending" | "uploading" | "done" | "error";
