import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { GlobalOverlayState } from '@/types/globalOverlay';

const initialState: GlobalOverlayState = {
  isOverlay: false,
  message: '',
};

export const globalOverlaySlice = createSlice({
  name: 'globalOverlay',
  initialState,
  reducers: {
    showOverlay: (state, action: PayloadAction<string | undefined>) => {
      state.isOverlay = true;
      state.message = action.payload;
    },
    hideOverlay: (state) => {
      state.isOverlay = false;
      state.message = '';
    },
  },
});

export const { showOverlay, hideOverlay } = globalOverlaySlice.actions;

export default globalOverlaySlice.reducer;
