import { motion } from 'motion/react';

import type { CouponData } from '@/types/coupon';

import CouponTicket from '@/components/CouponTicket';

type CouponSectionProps = {
  coupons: CouponData[];
  /** 首頁用 section 完整包裝（含標題、灰底背景）；購物車用 inline 嵌入 */
  type?: 'section' | 'inline';
};

function CouponSection({ coupons, type = 'section' }: CouponSectionProps) {
  const enabledCoupons = coupons.filter((coupon) => coupon.is_enabled === 1);

  // 無優惠券
  if (enabledCoupons.length === 0) return null;

  // 優惠券列表
  const couponList = (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-2">
      {enabledCoupons.map((coupon) => (
        <div className="col" key={coupon.id}>
          <CouponTicket coupon={coupon} />
        </div>
      ))}
    </div>
  );

  if (type === 'inline') {
    return (
      <div className="mb-4">
        {/* 分隔標題 */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-ticket-perforated text-gray-600"></i>
          <span className="fs-7 text-gray-600 text-nowrap">推薦優惠券</span>
          <div style={{ flex: 1, height: '1px', background: '#e0d8cc' }} />
        </div>
        {couponList}
      </div>
    );
  }

  return (
    <section className="py-5 py-md-7 border-top border-bottom" style={{ background: '#fff7ed', borderColor: '#f3e8d6' }}>
      <motion.div className="container-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <h2 className="h1 fw-bold text-center mb-2">限時優惠，現在使用</h2>
        <p className="text-gray-600 text-center mb-3">結帳時輸入優惠碼即可折抵，請把握期限</p>
        <div className="mb-3">{couponList}</div>
      </motion.div>
    </section>
  );
}

export default CouponSection;
