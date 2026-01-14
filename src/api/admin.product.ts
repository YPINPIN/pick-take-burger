import adminApi from '@/api/admin';
import type { GetProductsParams, GetProductsResponse } from '@/types/product';

const API_PATH = import.meta.env.VITE_API_PATH;

export const apiAdminGetProducts = async (params: GetProductsParams): Promise<GetProductsResponse> => {
  const res = await adminApi.get<GetProductsResponse>(`/api/${API_PATH}/admin/products`, { params });
  return res.data;
};
