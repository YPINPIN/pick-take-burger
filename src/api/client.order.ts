import clientApi from '@/api/client';
import type { CreateOrderParams, CreateOrderResponse, GetOrderResponse } from '@/types/order';

const API_PATH = import.meta.env.VITE_API_PATH;

// 建立訂單
export const apiClientCreateOrder = async (params: CreateOrderParams): Promise<CreateOrderResponse> => {
  const res = await clientApi.post<CreateOrderResponse>(`/api/${API_PATH}/order`, { data: params });
  return res.data;
};

// 取得指定訂單資料
export const apiClientGetOrder = async (orderId: string): Promise<GetOrderResponse> => {
  const res = await clientApi.get<GetOrderResponse>(`api/${API_PATH}/order/${orderId}`);
  return res.data;
};
