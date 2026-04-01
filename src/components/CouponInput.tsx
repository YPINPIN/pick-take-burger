import { useState } from 'react';

import useToast from '@/hooks/useToast';
import useCart from '@/hooks/useCart';

function CouponInput() {
  const { toastInfo } = useToast();
  const { applyCoupon } = useCart();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!code) {
      toastInfo('請輸入優惠券代碼');
      return;
    }

    setIsLoading(true);
    await applyCoupon(code);
    setCode('');
    setIsLoading(false);
  };

  return (
    <>
      <hr />
      <div className="my-3">
        <label htmlFor="coupon-code" className="fw-semibold text-dark mb-2 d-block">
          <i className="bi bi-ticket-perforated me-2"></i>
          優惠券
        </label>
        <div className="input-group">
          <input type="text" id="coupon-code" className="form-control" placeholder="請輸入優惠碼..." value={code} onChange={(e) => setCode(e.target.value.trim())} disabled={isLoading} />

          <button className="btn btn-outline-dark" type="button" onClick={handleApplyCoupon} disabled={isLoading}>
            {isLoading ? <span className="spinner-border spinner-border-sm" role="status"></span> : '套用'}
          </button>
        </div>
      </div>
    </>
  );
}

export default CouponInput;
