import { api } from "@/lib/api/axios";
import type { LoginFormData, RegisterFormData, User } from "@omni-site/schemas";

export async function loginApi(payload: LoginFormData): Promise<{ user: User }> {
  const { data } = await api.post<{ user: User }>("/auth/login", payload);
  return data;
}

export async function registerApi(
  payload: RegisterFormData
): Promise<{ id: string; email: string }> {
  const { data } = await api.post<{ id: string; email: string }>(
    "/auth/register",
    payload
  );
  return data;
}

export async function logoutApi(): Promise<{ ok: boolean }> {
  const { data } = await api.post<{ ok: boolean }>("/auth/logout");
  return data;
}

export async function refreshApi(): Promise<{ user: User }> {
  const { data } = await api.post<{ user: User }>("/auth/refresh");
  return data;
}

export async function meApi(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
