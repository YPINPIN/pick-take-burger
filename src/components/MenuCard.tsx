import { useNavigate } from 'react-router';

import type { ProductData } from '@/types/product';

import { PRODUCT_TAG_META, PRODUCT_RECOMMEND_META } from '@/utils/product';

type MenuCardProps = {
  product: ProductData;
};

function MenuCard({ product }: MenuCardProps) {
  const navigate = useNavigate();

  const handleAddToCart = (productId: string) => {
    console.log('handleAddToCart', productId);
  };

  return (
    <div className="menu-card-wrapper h-100 position-relative z-0">
      <div className="menu-card card h-100 bg-white position-relative z-1 overflow-hidden" onClick={() => navigate(`/menu/${product.id}`)}>
        {/* 圖片 + badge + overlay */}
        <div className="card-img-wrapper position-relative overflow-hidden">
          <img src={product.imageUrl} className="card-img-top" alt={product.title} />
          <span className="d-flex gap-2 position-absolute top-0 start-0 px-2 py-3 z-2">
            {/* 主廚推薦 */}
            {product.is_recommend === 1 && (
              <span className={`badge ${PRODUCT_RECOMMEND_META.badgeClass}`}>
                <i className={PRODUCT_RECOMMEND_META.iconClass}></i>
                {PRODUCT_RECOMMEND_META.label}
              </span>
            )}
            {/* Tag 標籤 */}
            {product.tag !== 'normal' && PRODUCT_TAG_META[product.tag] && (
              <span className={`badge ${PRODUCT_TAG_META[product.tag].badgeClass}`}>
                <i className={PRODUCT_TAG_META[product.tag].iconClass}></i>
                {PRODUCT_TAG_META[product.tag].label}
              </span>
            )}
          </span>
          <div className="overlay position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center text-white fs-4 fw-bold pe-none">查看更多</div>
        </div>

        {/* 內容 */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primary fw-bold">{product.title}</h5>
          <p className="card-text text-secondary line-clamp-2 mb-2">{product.description}</p>
          {/* 下方--價格、按鈕 */}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-baseline gap-2">
              <span className="text-danger fs-5">${product.price}</span>
              <span className="text-muted text-decoration-line-through">${product.origin_price}</span>
              <span className="text-secondary">/ {product.unit}</span>
            </div>
            <button
              type="button"
              className="btn btn-accent btn-add-cart text-primary px-3 py-2"
              onClick={(e) => {
                // 阻止事件冒泡
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
            >
              <i className="bi bi-cart-plus-fill lh-1 fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;
