import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

import type { AdminOrderModalHandle, AdminOrderModalProps } from '@/types/modal';
import type { ApiError } from '@/types/error';
import type { OrderData } from '@/types/order';

import TrackOrderPanel from '@/components/TrackOrderPanel';

const AdminOrderModal = forwardRef<AdminOrderModalHandle, AdminOrderModalProps>(function AdminOrderModal({ onSuccess }, ref) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance

  // 訂單資料
  const [tempOrder, setTempOrder] = useState<OrderData | null>(null);

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  const open = useCallback((order: OrderData) => {
    setTempOrder({ ...order });
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

  // 執行訂單狀態更新
  const handleUpdateOrder = async () => {
    if (!tempOrder) return;
    setIsUpdating(true);
    try {
      // const data = await apiAdminUpdateOrder({ id: orderData.id, data: orderData });
      // toast.success(data.message);
      console.log(tempOrder);

      // 關閉 Modal
      close();
      // 通知父層刪除成功
      onSuccess();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div ref={modalRef} className="modal fade" id="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-custom-xl modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h3 className="modal-title fs-5 fw-bold d-flex align-items-center gap-2" id="staticBackdropLabel">
              <i className="bi bi-receipt"></i>
              <span>訂單詳情</span>
              {/* <span className="badge bg-danger fs-7 rounded-pill">{tempOrder?.status}</span> */}
            </h3>
            <button type="button" className="btn-close btn-close-white" onClick={close} disabled={isUpdating}></button>
          </div>
          <div className="modal-body">
            {tempOrder && (
              <div className="row">
                {/* 訂單內容 */}
                <div className="col-lg-7 mb-4 mb-lg-0">
                  <div className="bg-white border border-light rounded-4 shadow-sm px-4 py-4 text-primary">
                    <TrackOrderPanel order={tempOrder} />
                  </div>
                </div>
                {/* 訂購資訊 */}
                <div className="col-lg-5">
                  <div className="sticky-top bg-white border border-light rounded-4 shadow-sm px-4 py-4 text-primary">
                    <div className="row">
                      <div className="col-12">
                        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36 }}>
                            <i className="bi bi-person-lines-fill"></i>
                          </span>
                          訂購資訊
                          <span className={`badge fs-6 px-3 py-2 text-bg-${tempOrder.is_paid ? 'success' : 'danger'}`}>{tempOrder.is_paid ? '已付款' : '未付款'}</span>
                        </h3>
                      </div>
                      {/* 姓名 */}
                      <div className="col-12">
                        <label htmlFor="fullname" className="fw-medium mb-1">
                          <i className="bi bi-person me-2"></i>
                          姓名
                        </label>
                        <input disabled readOnly={true} type="text" id="fullname" className="form-control mb-2" value={tempOrder.user.name} />
                      </div>
                      {/* 手機 */}
                      <div className="col-12">
                        <label htmlFor="tel" className="fw-medium mb-1">
                          <i className="bi bi-phone me-2"></i>
                          手機
                        </label>
                        <input disabled readOnly type="tel" id="tel" className="form-control mb-2" value={tempOrder.user.tel} />
                      </div>
                      {/* Email */}
                      <div className="col-12">
                        <label htmlFor="email" className="fw-medium mb-1">
                          <i className="bi bi-envelope me-2"></i>
                          Email
                        </label>
                        <input disabled readOnly type="email" id="email" className="form-control mb-2" value={tempOrder.user.email} />
                      </div>
                      {/* 地址 */}
                      <div className="col-12">
                        <label htmlFor="address" className="fw-medium mb-1">
                          <i className="bi bi-geo-alt me-2"></i>
                          地址
                        </label>
                        <input disabled readOnly type="text" id="address" className="form-control mb-2" value={tempOrder.user.address} />
                      </div>
                      {/* 備註 */}
                      <div className="col-12">
                        <label htmlFor="message" className="fw-medium mb-1">
                          <i className="bi bi-chat-square-text me-2"></i>
                          備註訊息
                        </label>
                        <textarea disabled readOnly rows={2} id="message" className="form-control mb-3" value={tempOrder.message} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-gray-500 fw-medium px-5 py-2" onClick={close} disabled={isUpdating}>
              關閉
            </button>
            <button type="button" onClick={handleUpdateOrder} className="btn btn-accent text-gray-900 fw-bold px-5 py-2" disabled={isUpdating}>
              {isUpdating ? '更新中...' : '確認更新'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminOrderModal;
