import { api } from "@/lib/api/axios";
import type { LoginFormData, RegisterFormData, User } from "@omni-site/schemas";

export async function loginApi({ payload }: { payload: LoginFormData }): Promise<ApiResponse<{ user: User }>> {
  const res = await api.post<ApiResponse<{ user: User }>>("/auth/login", payload);
  return res.data;
}

export async function registerApi(
  { payload }: { payload: RegisterFormData }
): Promise<ApiResponse<{ id: string; email: string }>> {
  const res = await api.post<ApiResponse<{ id: string; email: string }>>(
    "/auth/register",
    payload
  );
  return res.data;
}

export async function logoutApi(): Promise<ApiResponse<{ ok: boolean }>> {
  const res = await api.post<ApiResponse<{ ok: boolean }>>("/auth/logout");
  return res.data;
}

export async function refreshApi(): Promise<ApiResponse<{ user: User }>> {
  const res = await api.post<ApiResponse<{ user: User }>>("/auth/refresh");
  return res.data;
}

export async function meApi(): Promise<ApiResponse<User>> {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data;
}
