import type { CartData } from '@/types/cart';

import { getCouponTheme } from '@/utils/coupon';

type OrderSummaryItemProps = { item: CartData };

function OrderSummaryItem({ item }: OrderSummaryItemProps) {
  return (
    <div>
      {/* 商品名稱 + 數量 */}
      <div className="d-flex justify-content-between align-items-center gap-1 mb-1">
        <span>
          <i className="bi bi-dot me-1"></i>
          {item.product.title}
        </span>
        <span className="flex-shrink-0">x {item.qty}</span>
      </div>
      {/* 價格 + 折扣 */}
      <div className="fw-semibold d-flex justify-content-end align-items-center gap-2">
        {item.coupon && <span className="text-gray-500 text-decoration-line-through">NT${item.total.toLocaleString()}</span>}
        <span>NT${item.final_total.toLocaleString()}</span>
      </div>
      {/* 優惠券名稱 */}
      {item.coupon && (
        <div className="d-flex justify-content-end align-items-center flex-wrap">
          <i className={`bi bi-ticket-perforated fs-5 lh-1 text-${getCouponTheme(item.coupon.percent)} me-2`}></i>
          <p className={`mb-0 badge bg-${getCouponTheme(item.coupon.percent)} text-white text-wrap`}>{item.coupon.title}</p>
        </div>
      )}
      <hr className="dashed-hr" />
    </div>
  );
}

export default OrderSummaryItem;
