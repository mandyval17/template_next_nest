import { api } from "@/lib/api/axios";
import type { ExampleFormData, ExampleResponse, ExamplesList } from "@omni-site/schemas";

export async function fetchExamples(): Promise<ExamplesList> {
  const { data } = await api.get<ExamplesList>("/examples");
  return data;
}

export async function createExample(
  payload: ExampleFormData
): Promise<ExampleResponse> {
  const { data } = await api.post<ExampleResponse>("/example", payload);
  return data;
}
