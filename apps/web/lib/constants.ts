export const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000")
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
