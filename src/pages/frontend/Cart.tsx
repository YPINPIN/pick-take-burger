import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import type { ApiError } from '@/types/error';
import { EDIT_QTY_TYPE } from '@/types/cart';
import type { CartData, EditQtyType } from '@/types/cart';
import type { ProductData } from '@/types/product';
import type { ConfirmModalHandle, ConfirmModalData } from '@/types/modal';

import useToast from '@/hooks/useToast';
import useGlobalOverlay from '@/hooks/useGlobalOverlay';
import useCart from '@/hooks/useCart';

import { apiClientGetAllProducts } from '@/api/client.product';

import ShopStatusBanner from '@/components/ShopStatusBanner';
import CartItem from '@/components/CartItem';
import CouponInput from '@/components/CouponInput';
import OrderSummary from '@/components/OrderSummary';
import EntityCarousel from '@/components/EntityCarousel';
import ProductCarouselCard from '@/components/ProductCarouselCard';
import ConfirmModal from '@/components/modals/ConfirmModal';
import CouponSection from '@/components/CouponSection';

import { FEATURED_COUPONS } from '@/utils/coupon';

function Cart() {
  const { toastError } = useToast();
  const { overlayState } = useGlobalOverlay();
  const { cartState, getCartInfo, addCartItem, editCartItem, deleteCartItem, clearCart } = useCart();

  // 主廚推薦產品
  const [list, setList] = useState<ProductData[]>([]);
  const [isListLoading, setIsListLoading] = useState<boolean>(false);

  // 確認 Modal
  const confirmModalRef = useRef<ConfirmModalHandle>(null);

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
        toastError(err.message);
      } finally {
        setIsListLoading(false);
      }
    };

    // 取得購物車
    getCartInfo();
    // 取得所有產品（for list 推薦列表）
    fetchAllProducts();
  }, [getCartInfo, toastError]);

  // 編輯購物車
  const handleEditCartItem = async (type: EditQtyType, cartItem: CartData) => {
    // 如果是減少且數量為 1 就刪除
    if (type === EDIT_QTY_TYPE.MINUS && cartItem.qty <= 1) {
      onDeleteCartItemClick(cartItem);
      return;
    }

    // 呼叫編輯購物車
    editCartItem(type, cartItem);
  };

  // 開啟確認 Modal
  const openConfirmModal = async (modalData: ConfirmModalData) => {
    confirmModalRef.current?.open(modalData);
  };

  // 刪除購物車項目確認
  const onDeleteCartItemClick = (cartItem: CartData) => {
    openConfirmModal({
      title: `刪除「 ${cartItem.product.title} 」`,
      message: '刪除後將無法恢復，請再次確認。',
      onConfirm: () => deleteCartItem(cartItem.id),
    });
  };

  // 清空購物車確認
  const onClearCartClick = () => {
    openConfirmModal({
      title: '清空購物車',
      message: '清空後將無法恢復，請再次確認。',
      onConfirm: () => clearCart(),
    });
  };

  // 輪播項目 render
  const renderCarouselItem = useCallback((product: ProductData) => <ProductCarouselCard product={product} onAddToCart={addCartItem} />, [addCartItem]);

  return (
    <>
      {/* Confirm Modal */}
      <ConfirmModal ref={confirmModalRef} />
      <div className="container-lg py-5">
        <div className="mb-3">
          {/* 商店狀態 */}
          <ShopStatusBanner type="banner" />
        </div>
        <div className="mb-4">
          <h1 className="fs-2 fw-bold text-dark mb-2">您的購物車</h1>
          {cartState.carts.length > 0 ? (
            <>
              <p className="fs-6 text-gray-600 mb-3">
                準備結帳？目前已選購了 <span className="text-primary fw-bold">{cartState.carts.length}</span> 項美味餐點。
              </p>
              <div className="row g-4 mb-4">
                {/* 購物車內容 */}
                <div className="col-md-7 col-lg-8">
                  <div className="bg-white rounded-4 shadow-sm px-4 py-2">
                    {/* 購物車列表 */}
                    {cartState.carts.map((item) => (
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
                  <OrderSummary cart={cartState} couponSlot={<CouponInput />}>
                    {/* 結帳 */}
                    <Link to="/checkout" className="btn btn-accent btn-lg fw-bold w-100">
                      前往結帳
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </OrderSummary>
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

        <CouponSection coupons={FEATURED_COUPONS} type="inline" />

        {/* 推薦列表 */}
        <EntityCarousel items={list} itemKey="id" renderItem={renderCarouselItem} isLoading={isListLoading} title="主廚推薦" autoplay={true} loop={true} navigation={true} />
      </div>
    </>
  );
}

export default Cart;
