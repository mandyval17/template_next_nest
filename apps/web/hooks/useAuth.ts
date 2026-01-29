"use client";

import type { LoginFormData, User } from "@omni-site/schemas";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

export type AuthContextType = {
  user: User | null | undefined;
  login: (data: LoginFormData) => void;
  logout: () => void;
  loginState: UseMutationResult<User, Error, LoginFormData>;
  logoutState: UseMutationResult<void, Error, void>;
  meQuery: UseQueryResult<User | null, Error>;
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
