import { deleteMediaAction, requestCloudinaryUploadSignatureAction } from "@/actions/media.actions";
import type {
  CloudinaryUploadResourceType,
  CloudinaryUploadSignature,
  UploadedCloudinaryImage,
} from "@/types/cloudinary";

type UploadProgressHandler = (progress: number) => void;

type UploadParams = {
  resourceType: CloudinaryUploadResourceType;
  draftId: string;
  signature?: CloudinaryUploadSignature;
};

type UploadManyParams = UploadParams & {
  concurrency?: number;
};

function buildUploadFormData(file: File, signature: CloudinaryUploadSignature) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  return formData;
}

function mapUploadResponse(payload: Record<string, unknown>): UploadedCloudinaryImage {
  const imageUrl =
    typeof payload.secure_url === "string" ? payload.secure_url : "";
  const imagePublicId =
    typeof payload.public_id === "string" ? payload.public_id : "";

  if (!imageUrl || !imagePublicId) {
    throw new Error("Cloudinary upload returned an invalid payload");
  }

  return {
    imageUrl,
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

export async function uploadCloudinaryImage(
  file: File,
  params: UploadParams,
  onProgress?: UploadProgressHandler,
) {
  const signature =
    params.signature ??
    (await requestCloudinaryUploadSignatureAction({
      resourceType: params.resourceType,
      draftId: params.draftId,
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
          typeof (response.error as Record<string, unknown>).message === "string"
            ? ((response.error as Record<string, unknown>).message as string)
            : "Cloudinary upload failed";
        reject(new Error(message));
        return;
      }

      resolve(mapUploadResponse(response));
    };

    xhr.send(buildUploadFormData(file, signature));
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
    }));
  const concurrency = Math.max(1, params.concurrency ?? 4);
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
