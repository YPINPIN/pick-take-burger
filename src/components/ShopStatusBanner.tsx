import useShopStatus from '@/hooks/useShopStatus';

type ShopStatusBannerProps = {
  type?: 'banner' | 'badge' | 'payment_done';
};

function ShopStatusBanner({ type = 'banner' }: ShopStatusBannerProps) {
  const { isOpen, message, subMessage } = useShopStatus();

  if (type === 'badge' || type === 'payment_done') {
    const paymentDoneMessage = '訂單處理中，請耐心等候。';

    return (
      <div className="d-flex align-items-center flex-wrap gap-2">
        <span className={`badge ${isOpen ? 'text-bg-accent' : 'text-bg-secondary'}`}>
          {isOpen ? <i className="bi bi-sun-fill me-1"></i> : <i className="bi bi-moon-fill me-1"></i>}
          {isOpen ? '營業中' : '店家休息中'}
        </span>
        <small className="text-muted">{type === 'payment_done' && isOpen ? paymentDoneMessage : subMessage}</small>
      </div>
    );
  }

  // banner (default)
  return (
    <div className={`alert ${isOpen ? 'alert-accent' : 'alert-secondary'} d-flex align-items-center gap-3 py-2 mb-0`} role="alert">
      <span>{isOpen ? <i className="bi bi-sun-fill fs-3"></i> : <i className="bi bi-moon-fill fs-3"></i>}</span>
      <div>
        <div className="fs-5 fw-bold">{message}</div>
        <small>{subMessage}</small>
      </div>
    </div>
  );
}

export default ShopStatusBanner;
