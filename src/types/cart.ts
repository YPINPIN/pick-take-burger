import type { ProductData } from './product';
import type { CouponData } from './coupon';

// 購物車內產品資料
export type CartData = {
  id: string; // 對應的購物車 id
  product_id: string; // 產品 id
  qty: number;
  product: ProductData;
  total: number; // 產品總計
  final_total: number; // 產品折扣後總計
  coupon?: CouponData;
};

// 購物車資料
export type CartInfo = {
  carts: CartData[];
  total: number; // 總計
  final_total: number; // 折扣後總計
};

// 加入購物車
export type AddCartParams = Pick<CartData, 'product_id' | 'qty'>;

// 編輯購物車
export type EditCartParams = {
  id: string; // 產品對應的購物車 id
  data: AddCartParams; // 產品資料
};

export type GetCartResponse = {
  success: boolean;
  data: CartInfo;
  message: unknown[];
};

export type AddCartResponse = {
  success: boolean;
  message: string;
  data: Omit<CartData, 'coupon'>;
};

export type EditCartResponse = {
  success: boolean;
  message: string;
  data: AddCartParams;
};

export type DeleteCartResponse = {
  success: boolean;
  message: string;
};
