import { Navigate } from 'react-router';

// Admin
import LoginPage from '@/pages/admin/LoginPage';
import AdminGuard from './pages/admin/AdminGuard';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ProductManagement from '@/pages/admin/ProductManagement';
import OrderManagement from '@/pages/admin/OrderManagement';

// Frontend
import FrontendLayout from '@/pages/frontend/FrontendLayout';
import HomePage from '@/pages/frontend/HomePage';
import MenuPage from '@/pages/frontend/MenuPage';

// NotFound
import NotFound from '@/pages/NotFound';

const routes = [
  // 前台相關
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <MenuPage /> },
    ],
  },
  // 後台相關
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    // for admin guard
    element: <AdminGuard />,
    children: [
      {
        // for admin dashboard layout (no path)
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            // /admin redirect to /admin/products
            element: <Navigate to="products" replace />,
          },
          {
            path: 'products',
            element: <ProductManagement />,
          },
          {
            path: 'orders',
            element: <OrderManagement />,
          },
        ],
      },
    ],
  },
  // 404
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
