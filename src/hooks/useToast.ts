import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/store';

import { createAsyncToast } from '@/slices/toastSlice';

function useToast() {
  const dispatch = useDispatch<AppDispatch>();

  const toastSuccess = useCallback(
    (message: string) => {
      dispatch(createAsyncToast({ type: 'success', message }));
    },
    [dispatch],
  );

  const toastError = useCallback(
    (message: string) => {
      dispatch(createAsyncToast({ type: 'error', message }));
    },
    [dispatch],
  );

  const toastInfo = useCallback(
    (message: string) => {
      dispatch(createAsyncToast({ type: 'info', message }));
    },
    [dispatch],
  );

  return { toastSuccess, toastError, toastInfo };
}

export default useToast;
