import clientApi from '@/api/client';
import type { GetProductsParams, GetProductsResponse, GetClientAllProductsResponse, GetClientProductDetailResponse } from '@/types/product';

const API_PATH = import.meta.env.VITE_API_PATH;

export const apiClientGetProducts = async (params: GetProductsParams): Promise<GetProductsResponse> => {
  const res = await clientApi.get<GetProductsResponse>(`/api/${API_PATH}/products`, { params });
  return res.data;
};

export const apiClientGetAllProducts = async (): Promise<GetClientAllProductsResponse> => {
  const res = await clientApi.get<GetClientAllProductsResponse>(`/api/${API_PATH}/products/all`);
  return res.data;
};

export const apiClientGetProductDetail = async (productId: string): Promise<GetClientProductDetailResponse> => {
  const res = await clientApi.get<GetClientProductDetailResponse>(`/api/${API_PATH}/product/${productId}`);
  return res.data;
};
