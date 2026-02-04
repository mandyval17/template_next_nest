"use client";

import { AuthContext } from "@/hooks/useAuth";
import AuthApi from "@/services/auth/auth.api";
import AuthService from "@/services/auth/auth.services";
import type { LoginFormData, User } from "@omni-site/schemas";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = AuthService.useLoginMutation();
  const logoutMutation = AuthService.useLogoutMutation();

  // Check auth status on mount by calling /auth/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await AuthApi.me();
        if (res?.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch {
        // Not authenticated or error - user is null
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(
    (data: LoginFormData, options?: { redirectTo?: string }) => {
      loginMutation.mutate(
        { payload: data },
        {
          onSuccess: (res) => {
            if (res?.data?.user) setUser(res.data.user);
            router.push(options?.redirectTo ?? "/");
          },
        }
      );
    },
    [loginMutation, router]
  );

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setUser(null);
        router.push("/login");
      },
    });
  }, [logoutMutation, router]);

  const value = {
    isLoading,
    user: user ?? undefined,
    login,
    logout,
    loginState: loginMutation,
    logoutState: logoutMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
