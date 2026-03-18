import type { CartData } from './cart';
import type { Pagination } from '@/types/pagination';

export type OrderUser = {
  name: string;
  email: string;
  tel: string;
  address: string;
};

export type OrderData = {
  id: string;
  create_at: number;
  is_paid: boolean;
  paid_date: number;
  message: string;
  products: {
    [key: string]: CartData;
  };
  total: number;
  user: OrderUser;
  num: number;
};

export type CheckoutFormData = OrderUser & {
  message?: string;
};

export type CreateOrderParams = {
  user: OrderUser;
  message?: string;
};

export type CreateOrderResponse = {
  success: boolean;
  message: string;
  orderId: string;
  total: number;
  create_at: number;
};

export type GetOrderResponse = {
  success: boolean;
  order: OrderData;
};

// 定義後台一次取得所有訂單請求型別
export type GetOrdersParams = {
  page?: string;
};

// 定義後台一次取得所有訂單回應型別
export type GetOrdersResponse = {
  success: boolean;
  orders: OrderData[];
  pagination: Pagination;
  messages: unknown[];
};

// 定義後台刪除指定訂單回應型別
export type DeleteOrderResponse = {
  success: boolean;
  message: string;
};
