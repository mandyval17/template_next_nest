export { };

declare global {
  /** Standardized API response from backend */
  type ApiResponse<T> = {
    data: T;
    message: string;
    /** Field-level validation errors (only present on validation failures) */
    errors?: Record<string, string[]>;
  };

  /** Error shape from axios interceptor */
  type CustomError = Error & {
    code?: string;
    name: string;
    request?: unknown;
    response?: {
      status?: number;
      data?: {
        data: null;
        message: string;
        /** Field-level validation errors */
        errors?: Record<string, string[]>;
      };
    };
  };
}
