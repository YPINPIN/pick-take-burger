import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import FullPageCardLayout from '@/components/layout/FullPageCardLayout';
import BurgerIcon from '@/components/BurgerIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <FullPageCardLayout>
      <div className="p-4 text-center">
        <BurgerIcon className="text-primary w-25 rounded-2 shadow-sm mb-4" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        <h1 className="fs-4 fw-bold mb-2">Pick & Take Burger</h1>
        <h2 className="text-secondary fs-5 fw-bold mb-4">404 Not Found，頁面不存在</h2>
        <div className="mb-4">
          <LoadingSpinner />
        </div>
        <p className="text-secondary fs-7 fw-medium">請稍後，正在跳轉至首頁...</p>
      </div>
    </FullPageCardLayout>
  );
}

export default NotFound;
