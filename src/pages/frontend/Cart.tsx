import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import { EDIT_QTY_TYPE } from '@/types/cart';
import type { CartInfo, CartData, EditCartParams, EditQtyType } from '@/types/cart';
import type { ProductData } from '@/types/product';
import type { GlobalOverlayState } from '@/types/globalOverlay';
import type { ConfirmModalHandle, ConfirmModalData } from '@/types/modal';

import { apiClientGetCartInfo, apiClientAddCartItem, apiClientEditCartItem, apiClientDeleteCartItem, apiClientClearCart } from '@/api/client.cart';
import { apiClientGetAllProducts } from '@/api/client.product';

import CartItem from '@/components/CartItem';
import GlobalOverlay from '@/components/GlobalOverlay';
import EntityCarousel from '@/components/EntityCarousel';
import ProductCarouselCard from '@/components/ProductCarouselCard';
import ConfirmModal from '@/components/modals/ConfirmModal';

function Cart() {
  // 購物車資料
  const [cart, setCart] = useState<CartInfo | null>();
  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);

  // 主廚推薦產品
  const [list, setList] = useState<ProductData[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  // 確認 Modal
  const confirmModalRef = useRef<ConfirmModalHandle>(null);

  // Overlay 顯示狀態 (fetch 狀態)
  const [overlayState, setOverlayState] = useState<GlobalOverlayState>({ isOverlay: false, message: '' });

  // 取得購物車資料
  const fetchCartInfo = async () => {
    setOverlayState({ isOverlay: true, message: '取得購物車中...' });
    const currentRequest: number = ++requestId.current;
    try {
      const data = await apiClientGetCartInfo();
      // 如果不是最新的請求就不更新
      if (currentRequest !== requestId.current) {
        // console.log('不是最新的請求', currentRequest, requestId.current);
        return;
      }
      setCart(data.data);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      if (currentRequest === requestId.current) {
        // 如果是最新的請求就關閉 loading
        setOverlayState({ isOverlay: false, message: '' });
      }
    }
  };

  // 初始化資料
  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsListLoading(true);
      try {
        const data = await apiClientGetAllProducts();
        // 取出主廚推薦的產品
        const list = data.products.filter((p) => p.is_recommend === 1);
        setList(list);
      } catch (error) {
        const err = error as ApiError;
        toast.error(err.message);
      } finally {
        setIsListLoading(false);
      }
    };

    // 取得購物車
    fetchCartInfo();
    // 取得所有產品（for list 推薦列表）
    fetchAllProducts();
  }, []);

  // 編輯購物車
  const handleEditCartItem = async (type: EditQtyType, cartItem: CartData) => {
    // 如果是減少且數量為 1 就刪除
    if (type === EDIT_QTY_TYPE.MINUS && cartItem.qty <= 1) {
      onDeleteCartItemClick(cartItem);
      return;
    }

    try {
      setOverlayState({ isOverlay: true, message: '更新購物車中...' });
      const params: EditCartParams = {
        id: cartItem.id,
        data: {
          product_id: cartItem.product_id,
          qty: type === EDIT_QTY_TYPE.PLUS ? cartItem.qty + 1 : cartItem.qty - 1,
        },
      };
      const data = await apiClientEditCartItem(params);
      toast.success(data.message);
      // 更新購物車
      await fetchCartInfo();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  };

  // 刪除指定購物車項目
  const handleDeleteCartItem = async (cartItemId: string) => {
    try {
      setOverlayState({ isOverlay: true, message: '更新購物車中...' });
      const data = await apiClientDeleteCartItem(cartItemId);
      toast.success(data.message);
      // 更新購物車
      await fetchCartInfo();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  };

  // 清空購物車
  const handleClearCart = async () => {
    try {
      setOverlayState({ isOverlay: true, message: '清空購物車中...' });
      const data = await apiClientClearCart();
      toast.success(data.message);
      // 更新購物車
      await fetchCartInfo();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  };

  // 開啟確認 Modal
  const openConfirmModal = async (modalData: ConfirmModalData) => {
    confirmModalRef.current?.open(modalData);
  };

  // 刪除購物車項目確認
  const onDeleteCartItemClick = (cartItem: CartData) => {
    openConfirmModal({
      title: `刪除「 ${cartItem.product.title}」`,
      message: '刪除後將無法恢復，請再次確認。',
      onConfirm: () => handleDeleteCartItem(cartItem.id),
    });
  };

  // 清空購物車確認
  const onClearCartClick = () => {
    openConfirmModal({
      title: '清空購物車',
      message: '清空後將無法恢復，請再次確認。',
      onConfirm: () => handleClearCart(),
    });
  };

  // 推薦列表加入購物車
  const handleAddToCart = useCallback(async (productId: string) => {
    try {
      setOverlayState({ isOverlay: true, message: '加入購物車中...' });
      const data = await apiClientAddCartItem({ product_id: productId, qty: 1 });
      toast.success(data.message);
      // 更新購物車
      await fetchCartInfo();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  }, []);

  // 輪播項目 render
  const renderCarouselItem = useCallback((product: ProductData) => <ProductCarouselCard product={product} onAddToCart={handleAddToCart} />, [handleAddToCart]);

  return (
    <>
      {/* 全域遮罩 */}
      <GlobalOverlay overlayState={overlayState} />
      {/* Confirm Modal */}
      <ConfirmModal ref={confirmModalRef} />
      <div className="container-lg">
        <div className="mb-4">
          <h1 className="fs-2 fw-bold text-dark mb-2">您的購物車</h1>
          {cart && cart.carts.length > 0 ? (
            <>
              <p className="fs-6 text-gray-600 mb-3">
                準備結帳？目前已選購了 <span className="text-primary fw-bold">{cart.carts.length}</span> 項美味餐點。
              </p>
              <div className="row g-4 mb-4">
                {/* 購物車內容 */}
                <div className="col-md-7 col-lg-8">
                  <div className="bg-white rounded-4 shadow-sm px-4 py-2">
                    {/* 購物車列表 */}
                    {cart.carts.map((item) => (
                      <CartItem key={`cartItem-${item.id}`} item={item} onEditItemClick={handleEditCartItem} onDeleteItemClick={onDeleteCartItemClick} />
                    ))}

                    {/* 底部操作區 */}
                    <div className="d-flex justify-content-between align-items-center py-3 gap-2">
                      <Link to="/menu" className={`btn btn-primary fw-bold ${overlayState.isOverlay ? 'disabled' : ''}`}>
                        <i className="bi bi-arrow-left me-2"></i>
                        繼續點餐
                      </Link>
                      <button className="btn btn-danger fw-bold" onClick={onClearCartClick} disabled={overlayState.isOverlay}>
                        <i className="bi bi-trash3-fill me-2"></i>
                        清空購物車
                      </button>
                    </div>
                  </div>
                </div>

                {/* 訂單摘要 */}
                <div className="col-md-5 col-lg-4">
                  <div className="custom-sticky-top bg-white p-4 rounded-4 shadow-sm overflow-hidden">
                    <h2 className="text-dark fs-5 fw-semibold mb-4">
                      <i className="bi bi-receipt me-2"></i>
                      訂單摘要
                    </h2>
                    {cart.carts.map((item) => (
                      <div key={`checkOutItem-${item.id}`}>
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
                        <hr className="dashed-hr" />
                      </div>
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
                    <Link to="/checkout" className={`btn btn-accent btn-lg fw-bold w-100 ${overlayState.isOverlay ? 'disabled' : ''}`}>
                      前往結帳
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-600 d-flex justify-content-center align-items-center gap-2">
              <i className="bi bi-fork-knife fs-1"></i>
              <p className="fs-3">尚未選購任何美味餐點</p>
            </div>
          )}
        </div>

        {/* 推薦列表 */}
        <EntityCarousel items={list} itemKey="id" renderItem={renderCarouselItem} isLoading={isListLoading} title="主廚推薦" autoplay={true} loop={true} navigation={true} />
      </div>
    </>
  );
}

export default Cart;
