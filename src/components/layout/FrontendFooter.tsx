import { openTimeStr, closeTimeStr } from '@/hooks/useShopStatus';

function FrontendFooter() {
  return (
    <footer className="fs-7 text-center px-2 py-3 bg-primary">
      <p className="text-white mb-1">
        營業時間：{openTimeStr} ~ {closeTimeStr} (目前僅提供台北市外送服務)
      </p>
      <p className="text-white">
        Copyright &copy; 2026 Pick & Take Burger All rights reserved.{' '}
        <a href="https://github.com/YPINPIN" target="_blank" rel="noopener noreferrer" className="text-white">
          <i className="bi bi-github me-1"></i>YPINPIN
        </a>
      </p>
    </footer>
  );
}

export default FrontendFooter;
