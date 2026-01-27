import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';

import { apiAdminLoginCheck } from '@/api/admin.login';
import { getToken } from '@/utils/token';

import LoginPage from '@/pages/admin/LoginPage';
import LoginCheckPage from '@/pages/admin/LoginCheckPage';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminFooter from '@/components/layout/AdminFooter';

import ProductManagement from '@/pages/admin/ProductManagement';

function AdminDashboard() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isProcessCheck, setIsProcessCheck] = useState<boolean>(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const closeMobileSidebar = () => setShowMobileSidebar(false);
  const toggleMobileSidebar = () => setShowMobileSidebar((show) => !show);

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
      {isProcessCheck && <LoginCheckPage />}
      {!isProcessCheck &&
        (!isAuth ? (
          <LoginPage setIsAuth={setIsAuth} />
        ) : (
          <div className="admin-dashboard d-flex position-relative">
            <AdminSidebar showMobileSidebar={showMobileSidebar} closeMobileSidebar={closeMobileSidebar} />
            <div className="admin-dashboard-right flex-fill d-flex flex-column min-w-0 min-vh-100">
              <AdminHeader title="產品管理" toggleMobileSidebar={toggleMobileSidebar} />
              {/* 主要內容 */}
              <main className="flex-fill bg-light px-4 py-5 overflow-x-auto">
                <ProductManagement />
              </main>
              <AdminFooter />
            </div>
          </div>
        ))}
    </>
  );
}

export default AdminDashboard;
