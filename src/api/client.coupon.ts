import clientApi from '@/api/client';

import type { ApplyCouponParams, ApplyCouponResponse } from '@/types/coupon';

const API_PATH = import.meta.env.VITE_API_PATH;

// 使用優惠券
export const apiClientApplyCoupon = async (params: ApplyCouponParams): Promise<ApplyCouponResponse> => {
  const res = await clientApi.post<ApplyCouponResponse>(`api/${API_PATH}/coupon`, { data: params });
  return res.data;
};
