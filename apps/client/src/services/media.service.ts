import "server-only";

import { requestServerApi } from "./shared/server-api-client";

export type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  uploadUrl: string;
};

export type DeleteMediaPayload = {
  publicId: string;
};

export type CreateCloudinaryUploadSignaturePayload = {
  resourceType: string;
  draftId: string;
};

function buildSignatureRequestBody(payload: CreateCloudinaryUploadSignaturePayload) {
  return JSON.stringify(payload);
}

export const mediaService = {
  createUploadSignature: async (payload: CreateCloudinaryUploadSignaturePayload) => {
    const response = await requestServerApi<CloudinaryUploadSignature>("/media/signature", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: buildSignatureRequestBody(payload),
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
