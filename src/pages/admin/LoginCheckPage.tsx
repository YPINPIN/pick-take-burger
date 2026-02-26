import FullPageCardLayout from '@/components/layout/FullPageCardLayout';
import BurgerIcon from '@/components/BurgerIcon';
import LoadingSpinner from '@/components/LoadingSpinner';

function LoginCheckPage() {
  return (
    <FullPageCardLayout>
      <div className="p-4 text-center">
        <BurgerIcon className="text-primary w-25 rounded-2 shadow-sm mb-4" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        <h1 className="fs-4 fw-bold mb-1">Pick & Take Burger</h1>
        <p className="text-secondary fs-7 fw-medium mb-2">管理後台系統</p>
        <div className="mb-2">
          <LoadingSpinner />
        </div>
        <h2 className="fs-5 fw-bold mb-2">登入狀態檢查中...</h2>
      </div>
      <div className="p-4 text-center bg-light border-top">
        <p className="text-secondary fw-bold">請稍後，正在跳轉至管理後台</p>
      </div>
    </FullPageCardLayout>
  );
}

export default LoginCheckPage;
