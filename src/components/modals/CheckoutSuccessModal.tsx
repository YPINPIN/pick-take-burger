import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'bootstrap';

import type { CheckoutSuccessModalData, CheckoutSuccessModalHandle, CheckoutSuccessModalProps } from '@/types/modal';

import BurgerIcon from '../BurgerIcon';
import { useNavigate } from 'react-router';

const CheckoutSuccessModal = forwardRef<CheckoutSuccessModalHandle, CheckoutSuccessModalProps>(function CheckoutSuccessModal(_, ref) {
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // Modal 資料
  const [modalData, setModalData] = useState<CheckoutSuccessModalData>({ orderId: '', total: 0 });

  const navigate = useNavigate();
  // 複製狀態
  const [copied, setCopied] = useState(false);

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  const open = useCallback((data: CheckoutSuccessModalData) => {
    setModalData(data);
    bsModal.current?.show();
  }, []);

  const close = useCallback(() => {
    // 解決 Modal Focus 錯誤
    (document.activeElement as HTMLElement)?.blur();
    bsModal.current?.hide();
  }, []);

  // 將 open、close 方法傳出
  useImperativeHandle(
    ref,
    () => ({
      open,
      close,
    }),
    [open, close],
  );

  // 複製
  const handleCopy = async () => {
    await navigator.clipboard.writeText(modalData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close2 = () =>
    new Promise<void>((resolve) => {
      if (!modalRef.current || !bsModal.current) return resolve();

      const handler = () => {
        modalRef.current?.removeEventListener('hidden.bs.modal', handler);
        resolve();
      };

      modalRef.current.addEventListener('hidden.bs.modal', handler);

      // 解決 Modal Focus 錯誤
      (document.activeElement as HTMLElement)?.blur();
      bsModal.current?.hide();
    });

  const handlePayment = async () => {
    await close2();
    // 跳轉到訂單追蹤頁面 (付款步驟)
    navigate(`/track-order/${modalData.orderId}?stepPay=true`, { replace: true });
  };

  return (
    <div ref={modalRef} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body bg-light px-3 py-4 p-sm-4">
            {/* header */}
            <div className="text-primary text-center mb-3">
              {/* logo */}
              <div className="d-flex justify-content-center align-items-center mb-3">
                <div className="p-3 w-25 ratio-1x1 d-flex justify-content-center align-items-center bg-accent bg-opacity-25 rounded-circle position-relative ">
                  <BurgerIcon bgColor={'transparent'} className="text-accent" style={{ maxWidth: '80px', maxHeight: '80px' }} />

                  <div className="d-flex justify-content-center align-items-center bg-primary rounded-circle border border-3 border-white shadow-sm position-absolute bottom-0 end-0">
                    <i className="bi bi-check fs-3 lh-1 text-white"></i>
                  </div>
                </div>
              </div>
              <h2 className="text-dark fs-3 fw-bold mb-3">Nice! 您的訂單已成立！</h2>
              <p className="text-gray-600">
                我們已收到您的訂單，廚房準備就緒 <i className="bi bi-egg-fried"></i>
                <i className="bi bi-fire"></i>
                <br />
                <strong>完成付款</strong>，我們就會立即開始製作！
              </p>
            </div>

            <div className="bg-white text-center p-3 rounded-2 shadow-sm mb-3">
              <h3 className="text-primary fs-5 fw-bold mb-1">
                應付金額：<span className="text-danger">NT${modalData.total.toLocaleString()}</span>
              </h3>
              <p className="text-dark text-break fs-5 fw-bold mb-1">{modalData.orderId}</p>
              <button type="button" className="btn btn-secondary btn-sm mb-2" onClick={handleCopy}>
                {copied ? <i className="bi bi-clipboard-check me-2"></i> : <i className="bi bi-clipboard me-2"></i>}
                {copied ? '已複製' : '複製'}訂單編號
              </button>
              <p className="text-muted fs-7">
                <i className="bi bi-info-circle-fill me-2 "></i>請務必保存此<strong>訂單編號</strong>，以便後續查詢與追蹤訂單。
              </p>
            </div>
            <div className="d-flex justify-content-center">
              <button type="button" className="btn btn-accent btn-lg fw-bold px-5 py-2 w-50" onClick={handlePayment}>
                前往付款
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CheckoutSuccessModal;
