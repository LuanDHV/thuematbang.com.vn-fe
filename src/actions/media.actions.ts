'use server';

import { mediaService } from "@/services/media.service";

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get("file");
  const resourceType = formData.get("resourceType");
  const resourceId = formData.get("resourceId");

  if (!(file instanceof File) || typeof resourceType !== "string") {
    throw new Error("Invalid media payload");
  }

  return mediaService.uploadImage({
    file,
    resourceType,
    resourceId:
      typeof resourceId === "string" && resourceId.trim().length > 0
        ? Number(resourceId)
        : undefined,
  });
}

export async function deleteMediaAction(publicId: string) {
  return mediaService.deleteImage({ publicId });
}
