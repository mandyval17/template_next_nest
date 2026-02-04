import { api } from "@/lib/api/axios";
import type { ExampleFormData, ExampleResponse, ExamplesList } from "@omni-site/schemas";

export default class ExampleApi {
  static async getExamples() {
    const res = await api.get<ApiResponse<ExamplesList>>("/examples");
    return res.data;
  }

  static async createExample(payload: ExampleFormData) {
    const res = await api.post<ApiResponse<ExampleResponse>>("/example", payload);
    return res.data;
  }
}
