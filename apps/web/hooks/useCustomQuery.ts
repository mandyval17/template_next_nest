"use client";

import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

/** Default error type (axios interceptor rejects with Error). */
export type ApiError = Error;

/** Optional overrides for query hooks (primitives only, no functions). */
export type QueryOptions = {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: boolean | number;
};

/** Thin wrapper over useQuery with consistent ApiError typing. */
export function useCustomQuery<TData>(
  options: UseQueryOptions<TData, ApiError, TData>
): UseQueryResult<TData, ApiError> {
  return useQuery<TData, ApiError, TData>(options);
}

/** Thin wrapper over useMutation with consistent ApiError typing. */
export function useCustomMutation<
  TData = unknown,
  TError = ApiError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>(options);
}
