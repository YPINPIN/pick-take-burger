import adminApi from '@/api/admin';
import type { GetOrdersParams, GetOrdersResponse, DeleteOrderResponse, UpdateOrderParams, UpdateOrderResponse } from '@/types/order';

const API_PATH = import.meta.env.VITE_API_PATH;

// 取得所有訂單資料
export const apiAdminGetOrders = async (params: GetOrdersParams): Promise<GetOrdersResponse> => {
  const res = await adminApi.get<GetOrdersResponse>(`api/${API_PATH}/admin/orders`, { params });
  return res.data;
};

// 刪除指定訂單
export const apiAdminDeleteOrder = async (id: string): Promise<DeleteOrderResponse> => {
  const res = await adminApi.delete<DeleteOrderResponse>(`api/${API_PATH}/admin/order/${id}`);
  return res.data;
};

// 更新指定訂單資料
export const apiAdminUpdateOrder = async (params: UpdateOrderParams): Promise<UpdateOrderResponse> => {
  const { id, data } = params;
  const res = await adminApi.put<UpdateOrderResponse>(`api/${API_PATH}/admin/order/${id}`, { data });
  return res.data;
};
