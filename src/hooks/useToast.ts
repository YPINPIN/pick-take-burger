import { useCallback } from 'react';

import { useAppDispatch } from '@/store';

import { createAsyncToast } from '@/slices/toastSlice';

function useToast() {
  const dispatch = useAppDispatch();

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
