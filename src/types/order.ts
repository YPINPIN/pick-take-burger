import type { CartData } from './cart';
import type { Pagination } from '@/types/pagination';

export type OrderUser = {
  name: string;
  email: string;
  tel: string;
  address: string;
};

// ---- UI 層付款狀態（純顯示用）----
export const UI_ORDER_STATUS = {
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_DONE: 'payment_done',
} as const;
// ---- 後端訂單狀態機 ----
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELED: 'canceled',
} as const;
// ---- 型別 ----
export type UiOrderStatus = (typeof UI_ORDER_STATUS)[keyof typeof UI_ORDER_STATUS];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
// UI 顯示狀態型別(付款 + 後端狀態)
export type DisplayStatus = UiOrderStatus | OrderStatus;
// 每個狀態更新的時間
export type StatusTimestamps = Partial<Record<OrderStatus, number>>;

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
  // custom
  status?: OrderStatus; // 訂單狀態
  statusTimestamps?: StatusTimestamps; // 每個狀態更新的時間
  cancelledAt?: DisplayStatus; // 紀錄取消前的最後狀態
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

// 定義後台更新指定訂單請求型別
export type UpdateOrderParams = {
  id: string;
  data: OrderData;
};

// 定義後台更新指定訂單回應型別
export type UpdateOrderResponse = {
  success: boolean;
  message: string;
};
