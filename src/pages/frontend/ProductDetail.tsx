import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { ProductData } from '@/types/product';

import { apiClientGetProductDetail } from '@/api/client.product';

import { PRODUCT_TAG_META, PRODUCT_RECOMMEND_META } from '@/utils/product';

import LoadingSpinner from '@/components/LoadingSpinner';
import ProductDetailImages from '@/components/ProductDetailImages';

// 單次購物車數量限制
const MIN_QTY = 1;
const MAX_QTY = 10;

function ProductDetail() {
  const navigate = useNavigate();
  // url 參數
  const { productId } = useParams();

  const requestId = useRef<number>(0);

  // 產品資料
  const [product, setProduct] = useState<ProductData | null>(null);
  // fetch 狀態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 產品數量
  const [productQty, setProductQty] = useState<number>(1);

  useEffect(() => {
    const currentRequest: number = ++requestId.current;

    // 取得產品詳細資料
    const fetchProductDetail = async (id: string | undefined) => {
      setIsLoading(true);
      try {
        if (!id) return;
        const data = await apiClientGetProductDetail(id);

        // 如果不是最新的請求就不更新
        if (currentRequest !== requestId.current) {
          // console.log('不是最新的請求', currentRequest, requestId.current);
          return;
        }
        setProduct(data.product);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
        // 跳轉到 menu 頁面
        navigate('/menu', { replace: true });
      } finally {
        if (currentRequest === requestId.current) {
          // 如果是最新的請求就關閉 loading
          setIsLoading(false);
        }
      }
    };

    console.log('productId', productId);
    fetchProductDetail(productId);
  }, [productId, navigate]);

  // 產品數量限制
  const clamp = (value: number) => Math.min(Math.max(value, MIN_QTY), MAX_QTY);

  // 加入購物車
  const handleAddToCart = (productId: string) => {
    console.log('handleAddToCart', productId, productQty);
  };

  return (
    <div className="container-lg">
      {isLoading ? (
        <div className="d-flex justify-content-center py-5">
          <LoadingSpinner />
        </div>
      ) : product ? (
        <div className="row g-lg-5">
          {/* 左側 - 圖片 */}
          <div className="col-sm-9 col-md-6 col-lg-5 mx-auto">
            <div className="mb-3 mb-sm-4 mb-md-0">
              <ProductDetailImages imagesUrl={[product.imageUrl, ...product.imagesUrl]} />
            </div>
          </div>

          {/* 右側 - 白色資訊卡 */}
          <div className="col-sm-9 col-md-6 col-lg-7 mx-auto">
            <div className="bg-white rounded-4 shadow-sm p-4 p-lg-5">
              {/* 標籤區 */}
              {(product.is_recommend === 1 || product.tag !== 'normal') && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {product.is_recommend === 1 && (
                    <span className={`badge ${PRODUCT_RECOMMEND_META.badgeClass} py-2 px-3`}>
                      <i className={`${PRODUCT_RECOMMEND_META.iconClass} me-1`}></i>
                      {PRODUCT_RECOMMEND_META.label}
                    </span>
                  )}
                  {product.tag !== 'normal' && PRODUCT_TAG_META[product.tag] && (
                    <span className={`badge ${PRODUCT_TAG_META[product.tag].badgeClass} py-2 px-3`}>
                      <i className={`${PRODUCT_TAG_META[product.tag].iconClass} me-1`}></i>
                      {PRODUCT_TAG_META[product.tag].label}
                    </span>
                  )}
                </div>
              )}

              {/* 商品名稱 */}
              <h1 className="fw-bold text-dark mb-2">{product.title}</h1>

              {/* 價格區 */}
              <div className="d-flex flex-wrap align-items-baseline gap-2 mb-4">
                <span className="text-gray-500 text-decoration-line-through">NT${product.origin_price}</span>
                <span className="text-danger fs-2 fw-bold">NT${product.price}</span>
                <span className="text-gray-600">/ {product.unit}</span>
              </div>

              {/* 商品描述 */}
              {product.description && (
                <div className="bg-light rounded-3 p-3 mb-4">
                  <p className="fw-semibold text-gray-900 ">{product.description}</p>
                </div>
              )}

              {/* 商品說明區 */}
              {product.content && (
                <div>
                  <h2 className="fs-5 fw-bold text-primary mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    商品說明
                  </h2>
                  <p className="text-gray-600 lh-lg" style={{ whiteSpace: 'pre-line' }}>
                    {product.content}
                  </p>
                </div>
              )}

              <hr className="my-4" />

              {/* 購買區 */}
              <div className="d-flex flex-column gap-4">
                {/* 數量控制 */}
                <div>
                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-2">
                    <button type="button" className="btn btn-primary rounded-circle" style={{ width: '40px', height: '40px' }} disabled={productQty <= MIN_QTY} onClick={() => setProductQty((prev) => clamp(prev - 1))}>
                      <i className="bi bi-dash-lg"></i>
                    </button>

                    <input type="text" readOnly className="form-control text-center fw-bold fs-5 border-0" style={{ width: '80px' }} value={productQty} />

                    <button type="button" className="btn btn-primary rounded-circle" style={{ width: '40px', height: '40px' }} disabled={productQty >= MAX_QTY} onClick={() => setProductQty((prev) => clamp(prev + 1))}>
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                  {/* 提示 */}
                  {productQty >= MAX_QTY && (
                    <small className="text-secondary d-block text-center mt-2">
                      已達單次購買上限（{MAX_QTY} {product.unit}）
                    </small>
                  )}
                </div>

                {/* 加入購物車 */}
                <button type="button" className="btn btn-accent text-dark fs-5 fw-bold shadow-sm w-100 py-2" onClick={() => handleAddToCart(product.id)}>
                  <i className="bi bi-cart-plus-fill me-2"></i>
                  加入購物車 (NT${(product.price * productQty).toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="fs-4 text-primary">產品不存在</p>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
