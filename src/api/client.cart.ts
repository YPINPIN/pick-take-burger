import clientApi from '@/api/client';
import type { GetCartResponse, AddCartParams, AddCartResponse, EditCartParams, EditCartResponse, DeleteCartResponse } from '@/types/cart';

const API_PATH = import.meta.env.VITE_API_PATH;

// 取得購物車資訊
export const apiClientGetCartInfo = async (): Promise<GetCartResponse> => {
  const res = await clientApi.get<GetCartResponse>(`/api/${API_PATH}/cart`);
  return res.data;
};

// 新增購物車產品項目
export const apiClientAddCartItem = async (params: AddCartParams): Promise<AddCartResponse> => {
  const res = await clientApi.post<AddCartResponse>(`/api/${API_PATH}/cart`, { data: params });
  return res.data;
};

// 編輯購物車產品項目
export const apiClientEditCartItem = async (params: EditCartParams): Promise<EditCartResponse> => {
  const { id, data } = params;
  const res = await clientApi.put<EditCartResponse>(`/api/${API_PATH}/cart/${id}`, { data });
  return res.data;
};

// 刪除指定購物車產品項目
export const apiClientDeleteCartItem = async (itemCartId: string): Promise<DeleteCartResponse> => {
  const res = await clientApi.delete<DeleteCartResponse>(`api/${API_PATH}/cart/${itemCartId}`);
  return res.data;
};

// 刪除全部購物車項目
export const apiClientDeleteCartAll = async (): Promise<DeleteCartResponse> => {
  const res = await clientApi.delete<DeleteCartResponse>(`api/${API_PATH}/carts`);
  return res.data;
};
