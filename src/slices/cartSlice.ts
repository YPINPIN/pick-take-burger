import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { ApiError } from '@/types/error';
import type { CartInfo } from '@/types/cart';
import type { RootState } from '@/store';

import { apiClientGetCartInfo } from '@/api/client.cart';

type CartState = CartInfo & {
  currentRequestId?: string;
  isInitialized: boolean;
  couponCode?: string;
};

const initialState: CartState = {
  carts: [],
  total: 0,
  final_total: 0,
  // 當前請求 id（用於避免過時請求覆蓋最新資料）
  currentRequestId: undefined,
  // 購物車是否已經初始化 (避免 checkout 頁面在購物車資料尚未載入前就顯示空購物車)
  isInitialized: false,
  // 當前使用的優惠券 (用於判斷 addCartItem 是否需要自動重新套用 coupon)
  couponCode: undefined,
};

// 取得購物車資料
export const getCartAsync = createAsyncThunk<CartInfo, void, { rejectValue: string }>('cart/getCartAsync', async (_, { rejectWithValue }) => {
  try {
    const data = await apiClientGetCartInfo();
    return data.data;
  } catch (error) {
    const err = error as ApiError;
    return rejectWithValue(err.message);
  }
});

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartAsync.pending, (state, action) => {
        // 記錄最新 requestId
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        // 只更新最新的請求
        if (state.currentRequestId !== action.meta.requestId) {
          // console.log('不是最新的請求，跳過更新');
          return;
        }
        // 更新購物車資料
        state.carts = action.payload.carts;
        state.total = action.payload.total;
        state.final_total = action.payload.final_total;
        state.isInitialized = true;

        // 根據最新購物車資料來記錄 couponCode
        const couponCode = action.payload.carts[0]?.coupon?.code;
        // console.log('記錄 couponCode', couponCode);
        state.couponCode = couponCode ?? undefined;
      });
  },
});

export const cartSelector = (state: RootState) => state.cart;

export default cartSlice.reducer;
