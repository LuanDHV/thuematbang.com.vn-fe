import { z } from "zod";

export const uploadMediaMetaSchema = z.object({
  resourceType: z.string().trim().min(1, "resourceType is required"),
  resourceId: z.coerce.number().int().positive().optional(),
});

export const deleteMediaSchema = z.object({
  publicId: z.string().trim().min(1, "publicId is required"),
});
