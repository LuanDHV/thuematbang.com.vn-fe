import { z } from "zod";

export const cloudinaryUploadSignatureSchema = z.object({
  resourceType: z.string().trim().min(1, "resourceType is required"),
  draftId: z.string().trim().min(1, "draftId is required"),
  resourceId: z.coerce.number().int().positive().optional(),
});

export const deleteMediaSchema = z.object({
  publicId: z.string().trim().min(1, "publicId is required"),
});
