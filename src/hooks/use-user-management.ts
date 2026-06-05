"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMediaAction, uploadMediaAction } from "@/actions/media.actions";
import {
  changeMyPasswordAction,
  setMyPasswordAction,
  updateMyProfileAction,
} from "@/actions/user.actions";
import { AUTH_ME_QUERY_KEY } from "@/hooks/use-auth";

type UpdateMePayload = {
  fullName: string;
  phone: string;
  email?: string;
  avatar?: File;
};

type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type SetMyPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

function buildProfileFormData(payload: UpdateMePayload) {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("phone", payload.phone);
  if (payload.email) formData.append("email", payload.email);
  if (payload.avatar) formData.append("avatar", payload.avatar);
  return formData;
}

function buildMediaFormData(payload: {
  file: File;
  resourceType: string;
  resourceId?: number;
}) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("resourceType", payload.resourceType);
  if (typeof payload.resourceId === "number") {
    formData.append("resourceId", String(payload.resourceId));
  }
  return formData;
}

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMePayload) =>
      updateMyProfileAction(buildProfileFormData(payload)),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updatedUser);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: (payload: {
      file: File;
      resourceType: string;
      resourceId?: number;
    }) => uploadMediaAction(buildMediaFormData(payload)),
  });
}

export function useDeleteImageMutation() {
  return useMutation({
    mutationFn: (payload: { publicId: string }) => deleteMediaAction(payload.publicId),
  });
}

export function useChangeMyPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangeMyPasswordPayload) => changeMyPasswordAction(payload),
  });
}

export function useSetMyPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetMyPasswordPayload) => setMyPasswordAction(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
