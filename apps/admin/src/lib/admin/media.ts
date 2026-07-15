import { axiosInstance } from "../../providers/auth/auth-client";

export type AdminCloudinaryUploadResourceType =
  | "news"
  | "properties"
  | "projects"
  | "banners"
  | "users"
  | "rent-requests"
  | "static-pages"
  | "seo-contents";

export type AdminCloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  uploadUrl: string;
};

export type AdminUploadedMediaImage = {
  imageUrl: string;
  imagePublicId: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
};

export type AdminGalleryImage = AdminUploadedMediaImage & {
  id?: number;
  persisted?: boolean;
  sortOrder?: number;
};

export type AdminMediaUploadParams = {
  resourceType: AdminCloudinaryUploadResourceType;
  draftId: string;
  resourceId?: number | string;
};

function unwrapData<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as Record<string, unknown>).data !== undefined
  ) {
    return (payload as Record<string, unknown>).data as T;
  }

  return payload as T;
}

async function requestUploadSignature(params: AdminMediaUploadParams) {
  const { data } = await axiosInstance.post("/media/signature", params);
  return unwrapData<AdminCloudinaryUploadSignature>(data);
}

function buildUploadFormData(file: File, signature: AdminCloudinaryUploadSignature) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("upload_preset", "ml_default");
  return formData;
}

export async function uploadAdminMediaImage(
  file: File,
  params: AdminMediaUploadParams,
  onProgress?: (progress: number) => void,
) {
  const signature = await requestUploadSignature(params);

  return await new Promise<AdminUploadedMediaImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", signature.uploadUrl);
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => reject(new Error("Không thể tải ảnh lên."));
    xhr.onabort = () => reject(new Error("Đã hủy tải ảnh lên."));

    xhr.onload = () => {
      const response =
        (xhr.response as Record<string, unknown> | null | undefined) ??
        (() => {
          try {
            return JSON.parse(xhr.responseText) as Record<string, unknown>;
          } catch {
            return null;
          }
        })();

      if (xhr.status < 200 || xhr.status >= 300 || !response) {
        const error =
          typeof response?.error === "object" &&
          response.error &&
          typeof (response.error as Record<string, unknown>).message === "string"
            ? String((response.error as Record<string, unknown>).message)
            : "Không thể tải ảnh lên.";
        reject(new Error(error));
        return;
      }

      const imageUrl =
        typeof response.secure_url === "string" ? response.secure_url : "";
      const imagePublicId =
        typeof response.public_id === "string" ? response.public_id : "";

      if (!imageUrl || !imagePublicId) {
        reject(new Error("Phản hồi upload ảnh không hợp lệ."));
        return;
      }

      resolve({
        imageUrl,
        imagePublicId,
        width:
          typeof response.width === "number" && Number.isFinite(response.width)
            ? response.width
            : null,
        height:
          typeof response.height === "number" && Number.isFinite(response.height)
            ? response.height
            : null,
        bytes:
          typeof response.bytes === "number" && Number.isFinite(response.bytes)
            ? response.bytes
            : null,
      });
    };

    xhr.send(buildUploadFormData(file, signature));
  });
}

export async function deleteAdminMediaImage(publicId: string) {
  await axiosInstance.delete(`/media?publicId=${encodeURIComponent(publicId)}`);
}

export function normalizeGalleryImage(
  image: Partial<AdminGalleryImage> & {
    id?: number;
    imageUrl?: string;
    imagePublicId?: string | null;
    sortOrder?: number;
  },
): AdminGalleryImage {
  return {
    id: image.id,
    imageUrl: image.imageUrl ?? "",
    imagePublicId: image.imagePublicId ?? null,
    width: image.width ?? null,
    height: image.height ?? null,
    bytes: image.bytes ?? null,
    persisted: typeof image.id === "number",
    sortOrder: image.sortOrder ?? 0,
  };
}
