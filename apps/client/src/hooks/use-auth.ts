"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/actions/user.actions";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/types";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export function useAuthMe() {
  return useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: getCurrentUserAction,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: async () => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
