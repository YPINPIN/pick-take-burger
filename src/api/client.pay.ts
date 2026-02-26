import clientApi from '@/api/client';
import type { PayResponse } from '@/types/pay';

const API_PATH = import.meta.env.VITE_API_PATH;

// 完成付款
export const apiClientPay = async (orderId: string): Promise<PayResponse> => {
  const res = await clientApi.post<PayResponse>(`/api/${API_PATH}/pay/${orderId}`);
  return res.data;
};
