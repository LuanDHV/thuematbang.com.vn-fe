"use server";

import { deleteMediaSchema, cloudinaryUploadSignatureSchema } from "@/schemas/media.schema";
import { mediaService } from "@/services/media.service";

export async function requestCloudinaryUploadSignatureAction(payload: {
  resourceType: string;
  draftId: string;
}) {
  const parsedPayload = cloudinaryUploadSignatureSchema.parse(payload);
  return mediaService.createUploadSignature(parsedPayload);
}

export async function deleteMediaAction(publicId: string) {
  const parsedPayload = deleteMediaSchema.parse({ publicId });
  return mediaService.deleteImage(parsedPayload);
}
