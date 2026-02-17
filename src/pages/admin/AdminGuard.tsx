import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';

import { apiAdminLoginCheck } from '@/api/admin.login';
import { getToken, clearToken } from '@/utils/token';

import LoginCheckPage from '@/pages/admin/LoginCheckPage';

// 後台權限檢查
function AdminGuard() {
  const navigate = useNavigate();

  // 檢查登入中狀態
  const [isProcessCheck, setIsProcessCheck] = useState<boolean>(true);

  // 第一次載入後台時檢查
  useEffect(() => {
    // 檢查是否已登入
    const checkAuth = async () => {
      setIsProcessCheck(true);
      const token = getToken();

      // 沒有 token 就跳轉到登入頁
      if (!token) {
        navigate('/login', { replace: true });
        toast.info('請先登入');
        return;
      }

      // 當驗證失敗時，清除 token 並跳轉到登入頁
      try {
        await apiAdminLoginCheck();
        setIsProcessCheck(false);
      } catch (error) {
        const err = error as ApiError;
        // 清除 token
        clearToken();
        navigate('/login', { replace: true });
        toast.error(err.message);
      }
    };

    checkAuth();
  }, [navigate]);

  return isProcessCheck ? <LoginCheckPage /> : <Outlet />;
}

export default AdminGuard;
