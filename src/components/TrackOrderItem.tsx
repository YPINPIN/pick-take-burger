import type { CartData } from '@/types/cart';

import { getCouponTheme } from '@/utils/coupon';

type TrackOrderItemProps = {
  item: CartData;
};

function TrackOrderItem({ item }: TrackOrderItemProps) {
  return (
    <>
      <div className="d-flex align-items-center gap-3">
        {/* 圖片 + 資訊 */}
        <div className="flex-grow-1 min-w-0 d-flex align-items-center gap-3">
          <img src={item.product.imageUrl} alt={item.product.title} className="rounded-2" style={{ width: 60, aspectRatio: '1 / 1' }} />
          <div className="flex-grow-1 min-w-0">
            <p className="fs-6 fw-bold">{item.product.title}</p>
            <span className="fs-6 fw-semibold">x {item.qty}</span>
          </div>
        </div>
        {/* 價格 + 折扣 */}
        <div className="fw-semibold text-end">
          {item.coupon && <p className="text-gray-500 text-decoration-line-through">NT${item.total.toLocaleString()}</p>}
          <p>NT${item.final_total.toLocaleString()}</p>
        </div>
      </div>
      {/* 優惠券名稱 */}
      {item.coupon && (
        <div className="d-flex justify-content-end align-items-center flex-wrap">
          <i className={`bi bi-ticket-perforated fs-5 lh-1 text-${getCouponTheme(item.coupon.percent)} me-2`}></i>
          <p className={`mb-0 badge bg-${getCouponTheme(item.coupon.percent)} text-white text-wrap`}>{item.coupon.title}</p>
        </div>
      )}
    </>
  );
}

export default TrackOrderItem;
