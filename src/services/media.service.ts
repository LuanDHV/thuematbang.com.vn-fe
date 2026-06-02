import "server-only";

import { requestServerApi } from "./shared/server-api-client";

export type UploadMediaPayload = {
  file: File;
  resourceType: string;
  resourceId?: number;
};

export type UploadMediaResponse = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export type DeleteMediaPayload = {
  publicId: string;
};

function buildUploadFormData(payload: UploadMediaPayload) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("resourceType", payload.resourceType);
  if (typeof payload.resourceId === "number") {
    formData.append("resourceId", String(payload.resourceId));
  }
  return formData;
}

export const mediaService = {
  uploadImage: async (payload: UploadMediaPayload) => {
    const response = await requestServerApi<UploadMediaResponse>("/media/upload", {
      method: "POST",
      auth: "required",
      body: buildUploadFormData(payload),
    });
    return response.data;
  },

  deleteImage: async (payload: DeleteMediaPayload) => {
    const response = await requestServerApi<{ result?: string; message?: string }>(
      `/media?publicId=${encodeURIComponent(payload.publicId)}`,
      {
        method: "DELETE",
        auth: "required",
      },
    );
    return response.data;
  },
};
