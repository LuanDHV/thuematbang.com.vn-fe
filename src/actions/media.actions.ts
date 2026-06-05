'use server';

import { deleteMediaSchema, uploadMediaMetaSchema } from "@/schemas/media.schema";
import { mediaService } from "@/services/media.service";

export async function uploadMediaAction(formData: FormData) {
  const file = formData.get("file");
  // Parse metadata separately so file validation can stay explicit and type-safe.
  const parsedMeta = uploadMediaMetaSchema.parse({
    resourceType: formData.get("resourceType"),
    resourceId: formData.get("resourceId") || undefined,
  });

  if (!(file instanceof File) || file.size <= 0) {
    throw new Error("Invalid media payload");
  }

  return mediaService.uploadImage({
    file,
    resourceType: parsedMeta.resourceType,
    resourceId: parsedMeta.resourceId,
  });
}

export async function deleteMediaAction(publicId: string) {
  const parsedPayload = deleteMediaSchema.parse({ publicId });
  return mediaService.deleteImage(parsedPayload);
}
