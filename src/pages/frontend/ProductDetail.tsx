import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { ProductData } from '@/types/product';
import type { GlobalOverlayState } from '@/types/globalOverlay';

import { apiClientGetProductDetail, apiClientGetProducts } from '@/api/client.product';
import { apiClientAddCartItem } from '@/api/client.cart';

import { PRODUCT_TAG_META, PRODUCT_RECOMMEND_META } from '@/utils/product';

import LoadingSpinner from '@/components/LoadingSpinner';
import ProductDetailImages from '@/components/ProductDetailImages';
import GlobalOverlay from '@/components/GlobalOverlay';
import EntityCarousel from '@/components/EntityCarousel';
import ProductCarouselCard from '@/components/ProductCarouselCard';

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
  // 自己的 id
  const myId: string | undefined = useMemo(() => product?.id, [product]);
  // fetch 狀態
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 推薦產品
  const [list, setList] = useState<ProductData[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  // 產品數量
  const [productQty, setProductQty] = useState<number>(1);
  // 加入購物車
  const [isAddToCart, setIsAddToCart] = useState<boolean>(false);

  // Overlay 顯示狀態
  const [overlayState, setOverlayState] = useState<GlobalOverlayState>({ isOverlay: false, message: '' });

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

    fetchProductDetail(productId);
  }, [productId, navigate]);

  useEffect(() => {
    if (!product) return;
    // API 抓取同 category 的所有產品去除自己
    const fetchCategoryProducts = async () => {
      setIsListLoading(true);
      try {
        const data = await apiClientGetProducts({
          category: product.category,
        });
        const list = data.products.filter((p) => p.id !== product.id);
        setList(list);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        setIsListLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [product]);

  // 產品數量限制
  const clamp = (value: number) => Math.min(Math.max(value, MIN_QTY), MAX_QTY);

  // 加入購物車 (與推薦列表共用)
  const handleAddToCart = useCallback(
    async (productId: string, qty: number = 1) => {
      try {
        setOverlayState({ isOverlay: true, message: '加入購物車中...' });
        if (myId === productId) {
          // 為自己時顯示 loading
          setIsAddToCart(true);
        }
        const data = await apiClientAddCartItem({ product_id: productId, qty });
        toast.success(data.message);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        if (myId === productId) {
          setIsAddToCart(false);
        }
        setOverlayState({ isOverlay: false, message: '' });
      }
    },
    [myId],
  );

  // 輪播項目 render
  const renderCarouselItem = useCallback((product: ProductData) => <ProductCarouselCard product={product} onAddToCart={handleAddToCart} />, [handleAddToCart]);

  return (
    <>
      {/* 全域遮罩 */}
      <GlobalOverlay overlayState={overlayState} />
      <div className="container">
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <LoadingSpinner />
          </div>
        ) : product ? (
          <div className="row g-lg-5">
            {/* 左側 - 圖片 */}
            <div className="col-sm-10 col-md-5 mx-auto">
              <div className="mb-3 mb-sm-4 mb-md-0">
                <ProductDetailImages imagesUrl={[product.imageUrl, ...product.imagesUrl]} />
              </div>
            </div>

            {/* 右側 - 白色資訊卡 */}
            <div className="col-sm-10 col-md-7 mx-auto">
              <div className="bg-white rounded-4 shadow-sm p-4 p-lg-5 mb-4 mb-md-0">
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
                        已達單次加入上限（{MAX_QTY} {product.unit}）
                      </small>
                    )}
                  </div>

                  {/* 加入購物車 */}
                  <button type="button" className="btn btn-accent text-dark fs-5 fw-bold shadow-sm w-100 py-2" onClick={() => handleAddToCart(product.id, productQty)} disabled={overlayState.isOverlay || isAddToCart}>
                    {isAddToCart ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : <i className="bi bi-cart-plus-fill me-2"></i>}
                    {isAddToCart ? '加入中...' : `加入購物車 (NT$${(product.price * productQty).toLocaleString()})`}
                  </button>
                </div>
              </div>
            </div>

            {/* 相關推薦列表 */}
            <div className="col-sm-10 col-md-12 mx-auto">
              <EntityCarousel
                items={list}
                itemKey="id"
                renderItem={renderCarouselItem}
                isLoading={isListLoading}
                title="您可能也會喜歡"
                autoplay={true}
                loop={true}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  576: { slidesPerView: 1 },
                  768: { slidesPerView: 3 },
                  992: { slidesPerView: 4 },
                }}
                navigation={true}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="fs-4 text-primary">產品不存在</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
