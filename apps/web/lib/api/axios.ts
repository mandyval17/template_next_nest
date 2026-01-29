import { API_BASE } from "@/lib/constants";
import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
  withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status === 401 && !original._retry && original.url !== "/auth/refresh") {
      original._retry = true;
      refreshPromise ??= api.post("/auth/refresh").finally(() => { refreshPromise = null; });
      await refreshPromise;
      return api(original);
    }
    const message =
      err.response?.data?.message ?? err.message ?? "Request failed";
    return Promise.reject(new Error(message));
  }
);
