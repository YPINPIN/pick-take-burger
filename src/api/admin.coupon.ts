import adminApi from '@/api/admin';

import type { GetCouponsParams, GetCouponsResponse, CreateCouponParams, CreateCouponResponse, EditCouponParams, EditCouponResponse, DeleteCouponResponse } from '@/types/coupon';

const API_PATH = import.meta.env.VITE_API_PATH;

// 取得所有優惠券資料
export const apiAdminGetCoupons = async (params: GetCouponsParams): Promise<GetCouponsResponse> => {
  const res = await adminApi.get<GetCouponsResponse>(`api/${API_PATH}/admin/coupons`, { params });
  return res.data;
};

// 建立優惠券
export const apiAdminCreateCoupon = async (params: CreateCouponParams): Promise<CreateCouponResponse> => {
  const res = await adminApi.post<CreateCouponResponse>(`api/${API_PATH}/admin/coupon`, { data: params });
  return res.data;
};

// 編輯優惠券
export const apiAdminEditCoupon = async (params: EditCouponParams): Promise<EditCouponResponse> => {
  const { id, data } = params;
  const res = await adminApi.put<EditCouponResponse>(`api/${API_PATH}/admin/coupon/${id}`, { data });
  return res.data;
};

// 刪除優惠券
export const apiAdminDeleteCoupon = async (id: string): Promise<DeleteCouponResponse> => {
  const res = await adminApi.delete<DeleteCouponResponse>(`api/${API_PATH}/admin/coupon/${id}`);
  return res.data;
};
