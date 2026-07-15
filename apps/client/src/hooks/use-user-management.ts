"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
};

type ChangeMyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type SetMyPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMePayload) =>
      updateMyProfileAction(payload),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, updatedUser);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
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
