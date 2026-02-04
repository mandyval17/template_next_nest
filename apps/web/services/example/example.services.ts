import { TTQOptions, useCustomMutation, useCustomQuery } from '@/hooks/tanstack/useCustomQuery';
import { useQueryClient } from "@tanstack/react-query";
import hash from "object-hash";
import ExampleApi from "./example.api";


export default class ExampleService {
  static getExamples(
    _args: { queryString?: string },
    _options?: TTQOptions,
  ) {
    return useCustomQuery({
      queryKey: ["examples", hash(_args)],
      queryFn: () =>
        ExampleApi.getExamples({
          queryString: _args?.queryString,
        }),
      ..._options,
    });
  }

  static createExample() {
    const queryClient = useQueryClient();
    return useCustomMutation({
      mutationFn: ExampleApi.createExample,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["examples"] });
      },
      onError: (_error: CustomError) => {
        // _error?.response?.data?.message for toast
      },
    });
  }
}
