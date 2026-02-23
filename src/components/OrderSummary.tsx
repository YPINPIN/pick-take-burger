import { Link } from 'react-router';

import type { CartInfo } from '@/types/cart';

import OrderSummaryItem from '@/components/OrderSummaryItem';

type OrderSummaryProps = {
  cart: CartInfo;
};

function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <div className="custom-sticky-top bg-white p-4 rounded-4 shadow-sm overflow-hidden">
      <h2 className="text-dark fs-5 fw-semibold mb-4">
        <i className="bi bi-receipt me-2"></i>
        訂單摘要
      </h2>
      {cart.carts.map((item) => (
        <OrderSummaryItem key={`orderSummaryItem-${item.id}`} item={item} />
      ))}
      {/* 小計 */}
      <div className="d-flex flex-wrap justify-content-between text-dark fw-semibold mb-1">
        <span>小計({cart.carts.length} 項)</span>
        <span>NT${cart.total.toLocaleString()}</span>
      </div>
      {/* 折扣 */}
      <div className="d-flex flex-wrap justify-content-between text-dark fw-semibold">
        <span>折扣</span>
        <span className="text-danger">- NT${(cart.total - cart.final_total).toLocaleString()}</span>
      </div>
      <hr />
      {/* 總計 */}
      <div className="d-flex flex-wrap justify-content-between fs-5 fw-semibold mb-4">
        <span className="text-dark">總計</span>
        <span className="text-danger">NT${cart.final_total.toLocaleString()}</span>
      </div>
      {/* 結帳 */}
      <Link to="/checkout" className="btn btn-accent btn-lg fw-bold w-100">
        前往結帳
        <i className="bi bi-arrow-right ms-2"></i>
      </Link>
    </div>
  );
}

export default OrderSummary;
