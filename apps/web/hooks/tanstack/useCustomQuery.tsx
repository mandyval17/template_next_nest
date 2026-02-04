import { NetworkMode, QueryMeta, useMutation, UseMutationOptions, UseMutationResult, useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export type TTQOptions = {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
  gcTime?: number;
  queryHash?: string;
  initialDataUpdatedAt?: number | (() => number | undefined);
  structuralSharing?: boolean | ((oldData: unknown | undefined, newData: unknown) => unknown);
  _defaulted?: boolean;
  meta?: QueryMeta;
  maxPages?: number;
  networkMode?: NetworkMode;
}

export function useCustomQuery<TData>(
  options: Omit<UseQueryOptions<TData, CustomError, TData>, 'queryFn'> & {
    queryFn: () => Promise<TData>;
  }
): UseQueryResult<TData, CustomError> {
  return useQuery<TData, CustomError, TData>({
    ...options,
  });
}


export function useCustomMutation<TData, TError = CustomError, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
  });
}
