import type { CartData } from './cart';

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
