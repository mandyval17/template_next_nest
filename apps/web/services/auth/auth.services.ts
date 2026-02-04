import type { LoginFormData, RegisterFormData, User } from '@omni-site/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useCustomMutation, useCustomQuery } from '@/hooks/tanstack/useCustomQuery';
import AuthApi from './auth.api';

export default class AuthService {
  static useMeQuery(options?: { enabled?: boolean }) {
    return useCustomQuery({
      queryKey: ['auth', 'me'],
      queryFn: () => AuthApi.me(),
      ...options,
    });
  }

  static useLoginMutation() {
    return useCustomMutation<ApiResponse<{ user: User }>, CustomError, { payload: LoginFormData }>({
      mutationFn: AuthApi.login,
      onError: (_error: CustomError) => {
        // _error?.response?.data?.message for toast
      },
    });
  }

  static useLogoutMutation() {
    const queryClient = useQueryClient();
    return useCustomMutation({
      mutationFn: () => AuthApi.logout(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      },
      onError: (_error: CustomError) => {
        // _error?.response?.data?.message for toast
      },
    });
  }

  static useRegisterMutation() {
    return useCustomMutation<ApiResponse<User>, CustomError, { data: RegisterFormData }>({
      mutationFn: AuthApi.register,
      onError: (_error: CustomError) => {
        // _error?.response?.data?.message for toast
      },
    });
  }
}
