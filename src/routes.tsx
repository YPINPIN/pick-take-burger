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
import ProductDetail from '@/pages/frontend/ProductDetail';
import TrackOrder from '@/pages/frontend/TrackOrder';
import TrackOrderIndex from '@/pages/frontend/TrackOrderIndex';
import TrackOrderDetail from '@/pages/frontend/TrackOrderDetail';
import AboutPage from '@/pages/frontend/AboutPage';
import Cart from '@/pages/frontend/Cart';
import Checkout from '@/pages/frontend/Checkout';

// NotFound
import NotFound from '@/pages/NotFound';

const routes = [
  // 前台相關
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'menu/:productId', element: <ProductDetail /> },
      {
        path: 'track-order',
        element: <TrackOrder />,
        children: [
          { index: true, element: <TrackOrderIndex /> },
          { path: ':orderId', element: <TrackOrderDetail /> },
        ],
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
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
