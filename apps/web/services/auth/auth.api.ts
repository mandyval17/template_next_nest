import type { LoginFormData, RegisterFormData, User } from '@omni-site/schemas';
import { axiosInstance } from '../axios';

export default class AuthApi {
  static async register({data}: {data:RegisterFormData}) {
    const res = await axiosInstance.post<ApiResponse<User>>('/auth/register', data);
    return res.data;
  }

  static async login({ payload }: { payload: LoginFormData }) {
    const res = await axiosInstance.post<ApiResponse<{ user: User }>>('/auth/login', payload);
    return res.data;
  }

  static async logout() {
    const res = await axiosInstance.post<ApiResponse<{ ok: true }>>('/auth/logout');
    return res.data;
  }

  static async me() {
    const res = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return res.data;
  }
}
