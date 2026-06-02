"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_ME_QUERY_KEY } from "@/hooks/use-auth";
import { userService } from "@/services/user.service";
import { mediaService } from "@/services/media.service";

// Hook to handle profile updates
export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateMe,
    // Run side effects on successful mutation
    onSuccess: async (updatedUser) => {
      // Optimistically update or sync the client-side cache immediately
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updatedUser);
      // Refetch data from server to ensure complete consistency
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

// Hook to handle file/image uploads to server
export function useUploadImageMutation() {
  return useMutation({
    mutationFn: mediaService.uploadImage,
  });
}

// Hook to handle image deletions from server
export function useDeleteImageMutation() {
  return useMutation({
    mutationFn: mediaService.deleteImage,
  });
}

export function useChangeMyPasswordMutation() {
  return useMutation({
    mutationFn: userService.changeMyPassword,
  });
}

export function useSetMyPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.setMyPassword,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
