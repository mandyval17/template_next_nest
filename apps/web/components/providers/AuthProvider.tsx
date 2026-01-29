"use client";

import { AuthContext } from "@/hooks/useAuth";
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} from "@/lib/services/auth.service";
import type { LoginFormData } from "@omni-site/schemas";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const meQuery = useMeQuery({ enabled: true });
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const user = loginMutation.isSuccess
    ? loginMutation.data
    : meQuery.data ?? null;

  const login = useCallback(
    (data: LoginFormData, options?: { redirectTo?: string }) => {
      loginMutation.mutate(data, {
        onSuccess: () => router.push(options?.redirectTo ?? "/"),
        onError: () => { },
      });
    },
    [loginMutation, router]
  );

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSettled: () => router.push("/login"),
    });
  }, [logoutMutation, router]);

  const value = {
    user: user ?? undefined,
    login,
    logout,
    loginState: loginMutation,
    logoutState: logoutMutation,
    meQuery,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
