import { Link } from 'react-router';

import { EDIT_QTY_TYPE } from '@/types/cart';
import type { CartData, EditQtyType } from '@/types/cart';

type CartItemProps = {
  item: CartData;
  onEditItemClick: (type: EditQtyType, cartItem: CartData) => void;
  onDeleteItemClick: (cartItem: CartData) => void;
};

function CartItem({ item, onEditItemClick, onDeleteItemClick }: CartItemProps) {
  return (
    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3 py-3 border-bottom">
      <div className="flex-grow-1 min-w-0 d-flex flex-lg-row-reverse gap-3">
        {/* 圖片 + 資訊 */}
        <div className="flex-grow-1 min-w-0 d-flex align-items-center gap-3">
          <img src={item.product.imageUrl} alt={item.product.title} className="rounded-2 align-self-start align-self-lg-center" style={{ width: 80, aspectRatio: '1 / 1' }} />
          <div className="flex-grow-1 min-w-0">
            <Link to={`/menu/${item.product.id}`} className="fs-5 fw-bold mb-1">
              {item.product.title}
            </Link>
            <p className="fs-7 text-muted text-truncate mb-1">{item.product.description}</p>
            <div className="d-flex flex-wrap align-items-baseline gap-2">
              <span className="fs-6 fw-semibold text-danger">NT${item.product.price}</span>
              <span className="fs-7 text-gray-600">/ {item.product.unit}</span>
            </div>
          </div>
        </div>
        {/* 刪除 */}
        <div className="d-flex align-items-start align-items-lg-center">
          <button type="button" className="btn btn-danger" onClick={() => onDeleteItemClick(item)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      {/* 數量控制 */}
      <div className="d-flex justify-content-between align-items-center gap-2">
        <button type="button" className="btn btn-gray-500" onClick={() => onEditItemClick(EDIT_QTY_TYPE.MINUS, item)}>
          <i className="bi bi-dash-lg"></i>
        </button>
        <span className="fs-5 fw-semibold text-center" style={{ minWidth: 80 }}>
          {item.qty}
        </span>
        <button type="button" className="btn btn-secondary" onClick={() => onEditItemClick(EDIT_QTY_TYPE.PLUS, item)}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
