import { useCallback } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';

import { showOverlay, hideOverlay } from '@/slices/globalOverlaySlice';

function useGlobalOverlay() {
  const dispatch = useAppDispatch();
  const overlayState = useAppSelector((state) => state.globalOverlay);

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
