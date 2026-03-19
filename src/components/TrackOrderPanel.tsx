import { useMemo } from 'react';

import type { OrderData } from '@/types/order';
import type { CartData } from '@/types/cart';

import CopyButton from '@/components/CopyButton';
import TrackOrderItem from '@/components/TrackOrderItem';

type TrackOrderPanelProps = {
  order: OrderData;
};

function TrackOrderPanel({ order }: TrackOrderPanelProps) {
  // 訂單中的商品列表
  const products: CartData[] = useMemo(() => Object.values(order?.products ?? {}), [order]);

  return (
    <div className="row">
      <div className="col-12">
        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center mb-3">
          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle me-2" style={{ width: 36, height: 36 }}>
            <i className="bi bi-bag-check-fill"></i>
          </span>
          <span className="me-2">訂單內容</span>
          <CopyButton copyText={order.id} btnText="訂單編號" />
        </h3>
      </div>
      <div className="col-12">
        <p className="fs-6 fw-bold text-primary mb-3">
          訂單編號：<span className="text-success">{order.id}</span>
        </p>
        <hr className="my-2" />
      </div>
      {/* 訂單列表 */}
      <div className="col-12">
        <div className="py-3">
          {products.map((product, index) => (
            <div key={`trackOrderItem-${product.id}`}>
              {index !== 0 && <hr className="dashed-hr my-2" />}
              <TrackOrderItem item={product} />
            </div>
          ))}
        </div>
      </div>
      {/* 總計 */}
      <div className="col-12">
        <hr className="my-2" />
        <div className="d-flex flex-wrap justify-content-between fs-5 fw-semibold">
          <span className="text-dark">總計</span>
          <span className="text-danger">NT${order.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPanel;
