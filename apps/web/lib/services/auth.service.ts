"use client";

import {
  useCustomMutation,
  useCustomQuery,
  type QueryOptions,
} from "@/hooks/useCustomQuery";
import {
  loginApi,
  logoutApi,
  meApi,
  refreshApi,
} from "@/lib/api/auth.api";
import { authKeys } from "@/lib/query/keys";
import { userSchema, type LoginFormData, type User } from "@omni-site/schemas";
import { useQueryClient } from "@tanstack/react-query";

export async function getMe(): Promise<User | null> {
  try {
    const data = await meApi();
    const parsed = userSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function refreshUser(): Promise<User | null> {
  try {
    const { user } = await refreshApi();
    const parsed = userSchema.safeParse(user);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function useMeQuery(options?: QueryOptions) {
  return useCustomQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    ...options,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useCustomMutation<User, Error, LoginFormData>({
    mutationFn: async (input) => {
      const { user } = await loginApi(input);
      const parsed = userSchema.safeParse(user);
      if (!parsed.success) throw new Error("Invalid login response");
      return parsed.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useCustomMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutApi();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useRefreshMutation() {
  const queryClient = useQueryClient();
  return useCustomMutation<User | null, Error, void>({
    mutationFn: refreshUser,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user ?? null);
    },
  });
}
