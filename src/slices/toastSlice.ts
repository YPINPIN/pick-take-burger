import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { Toast } from '@/types/toast';

const initialState: Toast[] = [];

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    createToast: (state, action) => {
      state.push({
        id: action.payload.id,
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      const index = state.findIndex((toast) => toast.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const createAsyncToast = createAsyncThunk('toast/createAsyncToast', async (payload: Omit<Toast, 'id'>, { dispatch, requestId }) => {
  // 新增 toast
  dispatch(
    createToast({
      ...payload,
      id: requestId,
    }),
  );
  // 1.5 秒後刪除
  setTimeout(() => {
    dispatch(removeToast(requestId));
  }, 1500);
});

export const { createToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
