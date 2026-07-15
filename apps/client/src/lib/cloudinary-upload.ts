import {
  deleteMediaAction,
  requestCloudinaryUploadSignatureAction,
} from "@/actions/media.actions";
import { applyCloudinaryWatermark } from "@/lib/cloudinary";
import type {
  CloudinaryUploadResourceType,
  CloudinaryUploadSignature,
  UploadedCloudinaryImage,
} from "@/types/cloudinary";

type UploadProgressHandler = (progress: number) => void;

type UploadParams = {
  resourceType: CloudinaryUploadResourceType;
  draftId: string;
  resourceId?: number | string;
  signature?: CloudinaryUploadSignature;
};

type UploadManyParams = UploadParams & {
  concurrency?: number;
};

const MIN_FILE_SIZE_TO_OPTIMIZE = 400 * 1024;
const MAX_UPLOAD_DIMENSION = 1920;
const OPTIMIZED_IMAGE_QUALITY = 0.82;
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

function buildUploadFormData(file: File, signature: CloudinaryUploadSignature) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  return formData;
}

function mapUploadResponse(
  payload: Record<string, unknown>,
): UploadedCloudinaryImage {
  const imageUrl =
    typeof payload.secure_url === "string" ? payload.secure_url : "";
  const imagePublicId =
    typeof payload.public_id === "string" ? payload.public_id : "";

  if (!imageUrl || !imagePublicId) {
    throw new Error("Cloudinary upload returned an invalid payload");
  }

  return {
    imageUrl: applyCloudinaryWatermark(imageUrl),
    imagePublicId,
    width:
      typeof payload.width === "number" && Number.isFinite(payload.width)
        ? payload.width
        : null,
    height:
      typeof payload.height === "number" && Number.isFinite(payload.height)
        ? payload.height
        : null,
    bytes:
      typeof payload.bytes === "number" && Number.isFinite(payload.bytes)
        ? payload.bytes
        : null,
  };
}

function getOptimizedFileName(fileName: string) {
  const lastDotIndex = fileName.lastIndexOf(".");
  const baseName =
    lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  return `${baseName}.webp`;
}

function loadImageElement(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không thể đọc ảnh để tối ưu."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

async function optimizeImageFile(file: File) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  if (
    !file.type.startsWith("image/") ||
    file.size < MIN_FILE_SIZE_TO_OPTIMIZE
  ) {
    return file;
  }

  const image = await loadImageElement(file);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) {
    return file;
  }

  const scale = Math.min(
    1,
    MAX_UPLOAD_DIMENSION / Math.max(sourceWidth, sourceHeight),
  );

  const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

  if (
    scale === 1 &&
    file.size <= MIN_FILE_SIZE_TO_OPTIMIZE * 2 &&
    file.type === "image/webp"
  ) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const optimizedBlob = await canvasToBlob(
    canvas,
    "image/webp",
    OPTIMIZED_IMAGE_QUALITY,
  );

  if (!optimizedBlob || optimizedBlob.size >= file.size) {
    return file;
  }

  return new File([optimizedBlob], getOptimizedFileName(file.name), {
    type: optimizedBlob.type || "image/webp",
    lastModified: file.lastModified,
  });
}

export async function uploadCloudinaryImage(
  file: File,
  params: UploadParams,
  onProgress?: UploadProgressHandler,
) {
  const uploadFile = await optimizeImageFile(file);
  const signature =
    params.signature ??
    (await requestCloudinaryUploadSignatureAction({
      resourceType: params.resourceType,
      draftId: params.draftId,
      resourceId: params.resourceId,
    }));

  return new Promise<UploadedCloudinaryImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", signature.uploadUrl);
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onerror = () => {
      reject(new Error("Cloudinary upload failed"));
    };

    xhr.onabort = () => {
      reject(new Error("Cloudinary upload was cancelled"));
    };

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
        const message =
          typeof response?.error === "object" &&
          response.error &&
          typeof (response.error as Record<string, unknown>).message ===
            "string"
            ? ((response.error as Record<string, unknown>).message as string)
            : "Cloudinary upload failed";
        reject(new Error(message));
        return;
      }

      resolve(mapUploadResponse(response));
    };

    xhr.send(buildUploadFormData(uploadFile, signature));
  });
}

export async function uploadCloudinaryImagesSettled(
  files: File[],
  params: UploadManyParams,
  onProgress?: (index: number, progress: number) => void,
) {
  if (!files.length) {
    return [];
  }

  const signature =
    params.signature ??
    (await requestCloudinaryUploadSignatureAction({
      resourceType: params.resourceType,
      draftId: params.draftId,
      resourceId: params.resourceId,
    }));
  const concurrency = Math.max(1, params.concurrency ?? 5);
  const results: PromiseSettledResult<UploadedCloudinaryImage>[] = [];

  for (let index = 0; index < files.length; index += concurrency) {
    const batch = files.slice(index, index + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((file, batchIndex) =>
        uploadCloudinaryImage(file, { ...params, signature }, (progress) =>
          onProgress?.(index + batchIndex, progress),
        ),
      ),
    );

    results.push(...batchResults);
  }

  return results;
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  await Promise.allSettled(
    publicIds.map((publicId) => deleteMediaAction(publicId)),
  );
}
