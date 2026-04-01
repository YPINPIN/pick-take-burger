import type { CouponData, CouponStatus, CouponStyle } from '@/types/coupon';

import { toTaiwanEndOfDayTimestamp } from '@/utils/date';

type CouponConfig = Omit<CouponData, 'due_date'> & { due_date: string };

// 優惠券設定 (前台要顯示的優惠券)
const coupons: CouponConfig[] = [
  {
    id: 'NY65',
    title: '新年特惠 65 折',
    code: 'NY65',
    is_enabled: 1,
    percent: 65,
    due_date: '2026-02-28',
  },
  {
    id: 'OPEN65',
    title: '開幕感謝優惠 65 折',
    code: 'OPEN65',
    is_enabled: 1,
    percent: 65,
    due_date: '2027-01-01',
  },
  {
    id: 'PICK-TAKE75',
    title: '店長推薦優惠 75 折',
    code: 'PICK-TAKE75',
    is_enabled: 1,
    percent: 75,
    due_date: '2026-10-01',
  },
  {
    id: 'SPRING80',
    title: '春日嚐鮮優惠 8 折',
    code: 'SPRING80',
    is_enabled: 1,
    percent: 80,
    due_date: '2026-04-05',
  },
  {
    id: 'BURGER90',
    title: '漢堡粉絲優惠 9 折',
    code: 'BURGER90',
    is_enabled: 1,
    percent: 90,
    due_date: '2026-07-01',
  },
  {
    id: 'FOODIE85',
    title: '老饕推薦優惠 85 折',
    code: 'FOODIE85',
    is_enabled: 1,
    percent: 85,
    due_date: '2026-04-10',
  },
];

// 優惠券資料
export const FEATURED_COUPONS: CouponData[] = coupons.map((coupon) => ({
  ...coupon,
  due_date: toTaiwanEndOfDayTimestamp(coupon.due_date),
}));

// 根據 percent 決定 theme
export const getCouponTheme = (percent: number): string => {
  if (percent < 70) return 'coupon-green';
  if (percent < 80) return 'coupon-blue';
  if (percent < 90) return 'coupon-orange';
  return 'coupon-brick';
};

// 根據 theme 生成 UI 顏色
export const getCouponStyle = (theme: string): CouponStyle => {
  const base = `var(--bs-${theme})`;

  return {
    theme,
    bg: base,
    text: '#fff',
    badgeBg: `color-mix(in srgb, ${base} 10%, white)`,
    badgeText: `color-mix(in srgb, ${base} 65%, black)`,
    badgeBorder: `color-mix(in srgb, ${base} 35%, white)`,
  };
};

// 根據 due_date 狀態決定 coupon status
export const getCouponStatus = (dueDate: number): CouponStatus => {
  const now = Date.now();
  const due = dueDate * 1000;

  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  if (now > due) return 'expired';
  if (due - now <= sevenDays) return 'expiring_soon';

  return 'active';
};
