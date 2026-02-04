"use client";

import type { LoginFormData, User } from "@omni-site/schemas";
import type { UseMutationResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

export type AuthContextType = {
  isLoading: boolean;
  user: User | null | undefined;
  login: (data: LoginFormData, options?: { redirectTo?: string }) => void;
  logout: () => void;
  loginState: UseMutationResult<ApiResponse<{ user: User }>, CustomError, { payload: LoginFormData }>;
  logoutState: UseMutationResult<ApiResponse<{ ok: true }>, CustomError, void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthOptional(): AuthContextType | null {
  return useContext(AuthContext);
}

export { AuthContext };
