import type { Pagination } from '@/types/pagination';

// 優惠券資料型別
export type CouponData = {
  id: string;
  title: string;
  code: string;
  is_enabled: 0 | 1;
  percent: number;
  due_date: number;
};

export type CreateCouponParams = Omit<CouponData, 'id'>;

export type EditCouponParams = {
  id: string;
  data: CreateCouponParams;
};

export type GetCouponsParams = {
  page?: string;
};

export type GetCouponsResponse = {
  success: boolean;
  coupons: CouponData[];
  pagination: Pagination;
  messages: unknown[];
};

type MessageResponse = {
  success: boolean;
  message: string;
};

export type CreateCouponResponse = MessageResponse;
export type EditCouponResponse = MessageResponse;
export type DeleteCouponResponse = MessageResponse;

// 定義前台使用優惠券型別
export type ApplyCouponParams = Pick<CouponData, 'code'>;

export type ApplyCouponResponse = {
  success: boolean;
  message: string;
  data: {
    final_total: number; // 折扣後總計
  };
};

// 前台顯示相關型別
// 優惠券狀態
export type CouponStatus = 'active' | 'expiring_soon' | 'expired';
// 優惠券 style
export type CouponStyle = {
  theme: string;
  bg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
};
