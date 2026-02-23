import type { ProductData } from './product';
import type { CouponData } from './coupon';

// 購物車內產品資料
export type CartData = {
  id: string; // 對應的 CartItem id
  product_id: string; // 產品 id
  qty: number; // 產品數量
  product: ProductData; // 產品
  total: number; // 產品總計
  final_total: number; // 產品折扣後總計
  coupon?: CouponData; // 產品套用的優惠券
};

// 購物車資料
export type CartInfo = {
  carts: CartData[];
  total: number; // 小計
  final_total: number; // 折扣後總計
};

// 加入購物車
export type AddCartParams = Pick<CartData, 'product_id' | 'qty'>;

// 編輯購物車
export type EditCartParams = {
  id: string; // 產品對應的 CartItem id
  data: AddCartParams; // 產品資料 (id, qty)
};

// 編輯購物車數量類型常數
// as const：屬性變 readonly，值被推為 literal type
export const EDIT_QTY_TYPE = { PLUS: 'plus', MINUS: 'minus' } as const;

// 取得 EDIT_QTY_TYPE 的型別
type EditQtyMap = typeof EDIT_QTY_TYPE;

// 從物件型別的 keys 取得對應 value 型別，生成 value union
// 也可直接寫 (typeof EDIT_QTY_TYPE)[keyof typeof EDIT_QTY_TYPE]
// 結果型別： 'plus' | 'minus'
export type EditQtyType = EditQtyMap[keyof EditQtyMap];

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
