import { useCallback, useRef } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';

import type { ApiError } from '@/types/error';
import type { CartData, EditQtyType, EditCartParams } from '@/types/cart';
import { EDIT_QTY_TYPE } from '@/types/cart';

import { cartSelector, getCartAsync } from '@/slices/cartSlice';

import { apiClientAddCartItem, apiClientEditCartItem, apiClientDeleteCartItem, apiClientClearCart } from '@/api/client.cart';
import { apiClientApplyCoupon } from '@/api/client.coupon';

import useToast from '@/hooks/useToast';
import useGlobalOverlay from '@/hooks/useGlobalOverlay';

type GetCartInfoOptions = {
  silent?: boolean;
};

function useCart() {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector(cartSelector);

  const { toastError, toastSuccess, toastInfo } = useToast();
  const { showGlobalOverlay, hideGlobalOverlay } = useGlobalOverlay();

  const latestRequestId = useRef<string>('');

  // 取得購物車資訊
  const getCartInfo = useCallback(
    async (options: GetCartInfoOptions = {}) => {
      const { silent = false } = options;
      if (!silent) {
        showGlobalOverlay('取得購物車中...');
      }
      const promise = dispatch(getCartAsync());
      latestRequestId.current = promise.requestId;
      try {
        // 使用 unwrap 來捕獲 rejected 的錯誤
        await promise.unwrap();
      } catch (error) {
        toastError(error as string);
      } finally {
        // 只有當前請求完成後才關閉 loading
        if (!silent && latestRequestId.current === promise.requestId) {
          hideGlobalOverlay();
        }
      }
    },
    [dispatch, showGlobalOverlay, hideGlobalOverlay, toastError],
  );

  // 加入購物車品項
  const addCartItem = useCallback(
    async (productId: string, qty: number = 1) => {
      showGlobalOverlay('加入購物車中...');
      try {
        const data = await apiClientAddCartItem({ product_id: productId, qty });
        toastSuccess(data.message);
        // 重新取得購物車資料
        await getCartInfo({ silent: true });
      } catch (error) {
        const err = error as ApiError;
        toastError(err.message);
      } finally {
        hideGlobalOverlay();
      }
    },
    [showGlobalOverlay, hideGlobalOverlay, toastSuccess, toastError, getCartInfo],
  );

  // 更新購物車品項
  const editCartItem = useCallback(
    async (type: EditQtyType, cartItem: CartData) => {
      showGlobalOverlay('更新購物車中...');
      try {
        const params: EditCartParams = {
          id: cartItem.id,
          data: {
            product_id: cartItem.product_id,
            qty: type === EDIT_QTY_TYPE.PLUS ? cartItem.qty + 1 : cartItem.qty - 1,
          },
        };
        const data = await apiClientEditCartItem(params);
        toastSuccess(data.message);
        // 重新取得購物車資料
        await getCartInfo({ silent: true });
      } catch (error) {
        const err = error as ApiError;
        toastError(err.message);
      } finally {
        hideGlobalOverlay();
      }
    },
    [showGlobalOverlay, hideGlobalOverlay, toastSuccess, toastError, getCartInfo],
  );

  // 刪除指定購物車項目
  const deleteCartItem = useCallback(
    async (cartItemId: string) => {
      showGlobalOverlay('更新購物車中...');
      try {
        const data = await apiClientDeleteCartItem(cartItemId);
        toastSuccess(data.message);
        // 重新取得購物車資料
        await getCartInfo({ silent: true });
      } catch (error) {
        const err = error as ApiError;
        toastError(err.message);
      } finally {
        hideGlobalOverlay();
      }
    },
    [showGlobalOverlay, hideGlobalOverlay, toastSuccess, toastError, getCartInfo],
  );

  // 清空購物車
  const clearCart = useCallback(async () => {
    showGlobalOverlay('清空購物車中...');
    try {
      const data = await apiClientClearCart();
      toastSuccess(data.message);
      // 重新取得購物車資料
      await getCartInfo({ silent: true });
    } catch (error) {
      const err = error as ApiError;
      toastError(err.message);
    } finally {
      hideGlobalOverlay();
    }
  }, [showGlobalOverlay, hideGlobalOverlay, toastSuccess, toastError, getCartInfo]);

  // 套用優惠券
  const applyCoupon = useCallback(
    async (code: string) => {
      if (!code) {
        toastInfo('請輸入優惠券代碼');
        return;
      }

      showGlobalOverlay('套用優惠券中...');
      try {
        const data = await apiClientApplyCoupon({ code });
        toastSuccess(data.message);
        // 重新取得購物車資料
        await getCartInfo({ silent: true });
      } catch (error) {
        const err = error as ApiError;
        toastError(err.message);
      } finally {
        hideGlobalOverlay();
      }
    },
    [showGlobalOverlay, hideGlobalOverlay, toastSuccess, toastError, toastInfo, getCartInfo],
  );

  return { cartState, getCartInfo, addCartItem, editCartItem, deleteCartItem, clearCart, applyCoupon };
}

export default useCart;
