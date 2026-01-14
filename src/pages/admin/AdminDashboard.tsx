import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';

import { apiAdminLoginCheck } from '@/api/admin.login';
import { getToken } from '@/utils/token';

import LoadingSpinner from '@/components/LoadingSpinner';
import LoginPage from '@/pages/admin/LoginPage';
import AdminSidebar from '@/components/layout/AdminSidebar';

import ProductManagement from '@/pages/admin/ProductManagement';

function AdminDashboard() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isProcessCheck, setIsProcessCheck] = useState<boolean>(true);

  // 檢查是否已登入
  const checkAuth = async () => {
    setIsProcessCheck(true);
    const token = getToken();
    // 有 token 才檢查
    if (token) {
      try {
        await apiAdminLoginCheck();
        setIsAuth(true);
      } catch (error) {
        const err = error as ApiError;
        setIsAuth(false);
        toast.error(err.message);
      } finally {
        setIsProcessCheck(false);
      }
    } else {
      setIsAuth(false);
      setIsProcessCheck(false);
      toast.info('請先登入');
    }
  };

  // 第一次載入時檢查
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      {isProcessCheck && (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <LoadingSpinner />
        </div>
      )}
      {!isProcessCheck &&
        (!isAuth ? (
          <LoginPage setIsAuth={setIsAuth} />
        ) : (
          <div className="admin-dashboard d-flex position-relative">
            <AdminSidebar />
            {/* Main Content */}
            <div className="admin-dashboard-right flex-fill d-flex flex-column min-vh-100 overflow-x-auto">
              <main className="flex-fill text-bg-secondary">
                <ProductManagement />
              </main>
            </div>
          </div>
        ))}
    </>
  );
}

export default AdminDashboard;
