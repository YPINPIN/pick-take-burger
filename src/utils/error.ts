import axios from 'axios';
import type { ApiError } from '@/types/error';

// 統一處理錯誤
export const normalizeApiError = (error: unknown): ApiError => {
  // axios 錯誤
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // API 有回應但 status 不是 2xx
      const data = error.response.data;
      return {
        success: false,
        message: (data?.message as string) || (data?.error as string) || '伺服器錯誤',
        data,
        rawError: error,
      };
    } else if (error.request) {
      // 發出去但沒收到回應（網路問題）
      return {
        success: false,
        message: '沒有收到伺服器回應',
        rawError: error,
      };
    } else {
      // request 配置錯誤或攔截器錯誤
      return {
        success: false,
        message: error.message || '請求錯誤',
        rawError: error,
      };
    }
  }

  // 其他 JS Error
  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      rawError: error,
    };
  }

  // 不明錯誤
  return {
    success: false,
    message: '未知錯誤',
    rawError: error,
  };
};
