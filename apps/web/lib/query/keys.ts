export const exampleKeys = {
  all: ["examples"] as const,
  lists: () => [...exampleKeys.all, "list"] as const,
  list: () => [...exampleKeys.lists()] as const,
};

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};
