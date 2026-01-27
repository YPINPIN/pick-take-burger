import adminApi from '@/api/admin';
import type { GetProductsParams, GetProductsResponse, CreateProductData, CreateProductResponse, UpdateProductParams, UpdateProductResponse, DeleteProductResponse } from '@/types/product';

const API_PATH = import.meta.env.VITE_API_PATH;

export const apiAdminGetProducts = async (params: GetProductsParams): Promise<GetProductsResponse> => {
  const res = await adminApi.get<GetProductsResponse>(`/api/${API_PATH}/admin/products`, { params });
  return res.data;
};

export const apiAdminCreateProduct = async (params: CreateProductData): Promise<CreateProductResponse> => {
  const res = await adminApi.post<CreateProductResponse>(`/api/${API_PATH}/admin/product`, { data: params });
  return res.data;
};

export const apiAdminUpdateProduct = async (params: UpdateProductParams): Promise<UpdateProductResponse> => {
  const { id, data } = params;
  const res = await adminApi.put<UpdateProductResponse>(`/api/${API_PATH}/admin/product/${id}`, { data });
  return res.data;
};

export const apiAdminDeleteProduct = async (id: string): Promise<DeleteProductResponse> => {
  const res = await adminApi.delete<DeleteProductResponse>(`/api/${API_PATH}/admin/product/${id}`);
  return res.data;
};
