import type { ExampleFormData, ExampleResponse, ExamplesList } from '@omni-site/schemas';
import { axiosInstance } from '../axios';

export default class ExampleApi {
    static async getExamples({ queryString }: { queryString?: string }) {
        const res = await axiosInstance.get<ApiResponse<ExamplesList>>(`/examples` + (queryString ? `?${queryString}` : ''));
        return res.data;
    }

    static async createExample({ data }: { data: ExampleFormData }) {
        const res = await axiosInstance.post<ApiResponse<ExampleResponse>>(`/example`, data);
        return res.data;
    }
}
