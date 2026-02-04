import { DEFAULT_BE_BASE_URL } from "@/const";

export function getURLConfig(): {
  baseURL?: string;
  storageBaseURL?: string;
} {
  const baseURL =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_BE_BASE_URL
      : DEFAULT_BE_BASE_URL;

  return { baseURL };
}
