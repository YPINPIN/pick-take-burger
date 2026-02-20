// 優惠券資料型別
export type CouponData = {
  id: string;
  title: string;
  code: string;
  is_enabled: 0 | 1;
  percent: number;
  due_date: number;
};
