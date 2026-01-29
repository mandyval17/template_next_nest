"use client";

import {
  useCustomMutation,
  useCustomQuery,
  type QueryOptions,
} from "@/hooks/useCustomQuery";
import {
  createExample as createExampleApi,
  fetchExamples as fetchExamplesApi,
} from "@/lib/api/example.api";
import { exampleKeys } from "@/lib/query/keys";
import {
  createExampleSchema,
  exampleResponseSchema,
  examplesListSchema,
  type ExampleFormData,
  type ExampleResponse,
  type ExamplesList,
} from "@omni-site/schemas";
import { useQueryClient } from "@tanstack/react-query";

export type CreateExampleInput = ExampleFormData;

/** Fetch list. Validates with Zod. */
export async function getExamples(): Promise<ExamplesList> {
  const data = await fetchExamplesApi();
  const parsed = examplesListSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid examples response");
  return parsed.data;
}

/** Create one. Validates input & response with Zod. */
export async function createExample(
  input: CreateExampleInput
): Promise<ExampleResponse> {
  const validated = createExampleSchema.parse(input);
  const data = await createExampleApi(validated);
  const parsed = exampleResponseSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid create response");
  return parsed.data;
}

/** TanStack Query hook: list examples. */
export function useExamplesQuery(options?: QueryOptions) {
  return useCustomQuery({
    queryKey: exampleKeys.list(),
    queryFn: getExamples,
    staleTime: 60 * 1000,
    ...options,
  });
}

/** TanStack Mutation hook: create example. Invalidates examples list on success. */
export function useCreateExampleMutation() {
  const queryClient = useQueryClient();
  return useCustomMutation<ExampleResponse, Error, CreateExampleInput>({
    mutationFn: createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exampleKeys.all });
    },
  });
}
