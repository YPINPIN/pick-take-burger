import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';

import { apiAdminLogout } from '@/api/admin.login';
import { clearToken } from '@/utils/token';

import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminFooter from '@/components/layout/AdminFooter';

function AdminDashboard() {
  const navigate = useNavigate();

  const [isProcessLogout, setIsProcessLogout] = useState<boolean>(false);
  // 手機版 sidebar 狀態
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const closeMobileSidebar = () => setShowMobileSidebar(false);
  const toggleMobileSidebar = () => setShowMobileSidebar((show) => !show);

  // 登出
  const handleLogout = async () => {
    setIsProcessLogout(true);
    try {
      const data = await apiAdminLogout();
      toast.success(data.message);
    } catch (error) {
      const err = error as ApiError;
      console.error(err);
    } finally {
      clearToken();
      // 登出成功，跳轉到登入頁
      navigate('/login', { replace: true });
      setIsProcessLogout(false);
    }
  };

  return (
    <div className="admin-dashboard d-flex position-relative">
      <AdminSidebar showMobileSidebar={showMobileSidebar} closeMobileSidebar={closeMobileSidebar} />
      <div className="admin-dashboard-right flex-fill d-flex flex-column min-w-0 min-vh-100">
        <AdminHeader title="產品管理" toggleMobileSidebar={toggleMobileSidebar} isProcessLogout={isProcessLogout} onLogoutClick={handleLogout} />
        {/* 主要內容 */}
        <main className="flex-fill bg-light px-4 py-5 overflow-x-auto">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminDashboard;
