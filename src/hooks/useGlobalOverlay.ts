import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from '@/store';

import { showOverlay, hideOverlay } from '@/slices/globalOverlaySlice';

function useGlobalOverlay() {
  const dispatch = useDispatch<AppDispatch>();
  const overlayState = useSelector((state: RootState) => state.globalOverlay);

  const showGlobalOverlay = useCallback(
    (message?: string) => {
      dispatch(showOverlay(message));
    },
    [dispatch],
  );

  const hideGlobalOverlay = useCallback(() => {
    dispatch(hideOverlay());
  }, [dispatch]);

  return { overlayState, showGlobalOverlay, hideGlobalOverlay };
}

export default useGlobalOverlay;
