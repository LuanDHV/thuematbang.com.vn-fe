// Define TypeScript types for upload request payload
export type UploadMediaPayload = {
  file: File;
  resourceType: string;
  resourceId?: number;
};

// Define TypeScript types for successful upload response
export type UploadMediaResponse = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

// Define TypeScript types for delete request payload
export type DeleteMediaPayload = {
  publicId: string;
};

// Service object containing media-related API calls
export const mediaService = {
  // Method to handle file upload using multipart FormData
  uploadImage: async (payload: UploadMediaPayload) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("resourceType", payload.resourceType);

    // Append resourceId if it exists and is a valid number
    if (typeof payload.resourceId === "number") {
      formData.append("resourceId", String(payload.resourceId));
    }

    // Call Next.js POST API route
    const response = await fetch("/api/v1/media/upload", {
      method: "POST",
      body: formData,
    });

    // Parse response body, return null if parsing fails
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Không thể tải ảnh lên");
    }

    return (data?.data ?? data) as UploadMediaResponse;
  },

  // Method to handle file deletion using URL query parameters
  deleteImage: async (payload: DeleteMediaPayload) => {
    // Call Next.js DELETE API route with encoded parameters
    const response = await fetch(
      `/api/v1/media?publicId=${encodeURIComponent(payload.publicId)}`,
      {
        method: "DELETE",
      },
    );

    // Parse response body, return null if parsing fails
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Không thể xóa ảnh cũ");
    }

    return data as { result?: string; message?: string };
  },
};
