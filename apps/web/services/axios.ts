import { DEFAULT_BE_BASE_URL } from '@/const';
import { getURLConfig } from '@/utils/urlConfig';
import axios, { type InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: DEFAULT_BE_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getURLConfig().baseURL ?? DEFAULT_BE_BASE_URL;
    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<unknown> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true;
      refreshPromise ??= axiosInstance.post('/auth/refresh').finally(() => { refreshPromise = null; });
      await refreshPromise;
      return axiosInstance(original);
    }
    const message = error.response?.data?.message ?? error.message ?? 'Request failed';
    const err = new Error(message) as CustomError;
    err.name = error.name ?? 'Error';
    err.request = error.request;
    err.response = error.response;
    return Promise.reject(err);
  },
);
