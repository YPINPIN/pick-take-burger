import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

import type { AdminOrderModalHandle, AdminOrderModalProps } from '@/types/modal';
import type { ApiError } from '@/types/error';
import type { OrderData, OrderStatus } from '@/types/order';

import { ORDER_STATUS, UI_ORDER_STATUS } from '@/types/order';
import { ORDER_STATUS_META, resolveDisplayStatus, getAvailableNextStatuses, getStatusTimestamps } from '@/utils/orderStatus';

import { apiAdminUpdateOrder } from '@/api/admin.order';
import { formatDate } from '@/utils/date';

import TrackOrderProgressPanel from '@/components/TrackOrderProgressPanel';
import TrackOrderPanel from '@/components/TrackOrderPanel';

const AdminOrderModal = forwardRef<AdminOrderModalHandle, AdminOrderModalProps>(function AdminOrderModal({ onSuccess }, ref) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance

  // 訂單資料
  const [tempOrder, setTempOrder] = useState<OrderData | null>(null);
  // 訂單狀態(紀錄更新用)
  const [status, setStatus] = useState<OrderStatus | null>(null);

  // UI 顯示訂單狀態 (根據 tempOrder 的 status 更新)
  const displayStatus = useMemo(() => (tempOrder ? resolveDisplayStatus(tempOrder) : UI_ORDER_STATUS.PAYMENT_PENDING), [tempOrder]);
  // select 可選狀態
  const availableStatuses = useMemo(() => (tempOrder ? getAvailableNextStatuses(tempOrder) : []), [tempOrder]);
  // 狀態是否有變更
  const isChanged = status !== null && status !== displayStatus;

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
    // 每次開啟重置，避免殘留上次選取值
    setStatus(null);
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

  // 執行訂單更新狀態
  const handleUpdateOrder = async () => {
    if (!tempOrder || !status) return;

    setIsUpdating(true);
    try {
      const now = Math.floor(Date.now() / 1000);

      if (status === ORDER_STATUS.CANCELED) {
        const updataData: OrderData = { ...tempOrder, status, statusTimestamps: getStatusTimestamps(tempOrder, status, now), cancelledAt: displayStatus };
        await apiAdminUpdateOrder({
          id: tempOrder.id,
          data: updataData,
        });
        setTempOrder(updataData);
        toast.success('訂單已取消');
      } else {
        const updataData: OrderData = { ...tempOrder, status, statusTimestamps: getStatusTimestamps(tempOrder, status, now) };
        await apiAdminUpdateOrder({
          id: tempOrder.id,
          data: updataData,
        });
        setTempOrder(updataData);
        toast.success('訂單狀態已更新');
      }
      //更新成功後重置狀態選擇
      setStatus(null);
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
              訂單詳情
            </h3>
            <button type="button" className="btn-close btn-close-white" onClick={close} disabled={isUpdating}></button>
          </div>
          <div className="modal-body">
            {tempOrder && (
              <div className="row">
                <div className="col-12 mb-4">
                  <div className="bg-white border border-light rounded-4 shadow-sm px-4 py-4 text-primary">
                    {/* 訂單狀態追蹤 */}
                    <TrackOrderProgressPanel order={tempOrder} />
                    {/* 狀態更新 */}
                    <div className="row">
                      <div className="col-12">
                        <div className="row g-2 align-items-center">
                          <div className="col-auto">
                            <label htmlFor="status" className="fw-medium">
                              更新狀態為
                            </label>
                          </div>
                          <div className="col">
                            <select className="form-select form-select-sm" style={{ minWidth: '155px' }} id="status" value={status ?? ''} onChange={(e) => setStatus(e.target.value as OrderStatus)} disabled={isUpdating || availableStatuses.length === 0}>
                              <option value="" disabled>
                                {!tempOrder.is_paid ? '付款後才可更新' : availableStatuses.length === 0 ? '訂單已結束' : '選擇新狀態'}
                              </option>
                              {availableStatuses.map((key) => (
                                <option key={key} value={key}>
                                  {ORDER_STATUS_META[key].label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-12 col-sm-auto">
                            <button type="button" onClick={handleUpdateOrder} className="btn btn-accent btn-sm text-gray-900 fw-bold px-4 py-1 w-100" disabled={isUpdating || !isChanged}>
                              {isUpdating ? '更新中...' : '更新狀態'}
                            </button>
                          </div>
                          <div className="col-12">
                            {/* 未付款提示 */}
                            {!tempOrder.is_paid && (
                              <p className="text-secondary small">
                                <i className="bi bi-info-circle me-1" />
                                訂單尚未付款，請等待顧客完成付款後再進行狀態更新。
                              </p>
                            )}
                            {/* 訂單結束提示 */}
                            {tempOrder.is_paid && availableStatuses.length === 0 && (
                              <p className="text-secondary small">
                                <i className="bi bi-check-circle me-1" />
                                此訂單已結束，無法再次更新。
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                        </h3>
                      </div>
                      {/* 下單日期 */}
                      <div className="col-12">
                        <label htmlFor="orderDate" className="fw-medium mb-1">
                          <i className="bi bi-calendar-check me-2"></i>
                          下單日期
                        </label>
                        <input disabled readOnly type="text" id="orderDate" className="form-control mb-2" value={formatDate(tempOrder.create_at)} />
                      </div>
                      {/* 付款日期 */}
                      {tempOrder.paid_date && (
                        <div className="col-12">
                          <label htmlFor="paidDate" className="fw-medium mb-1">
                            <i className="bi bi-wallet-fill me-2"></i>
                            付款日期
                          </label>
                          <input disabled readOnly type="text" id="paidDate" className="form-control mb-2" value={formatDate(tempOrder.paid_date)} />
                        </div>
                      )}
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
                        <textarea disabled readOnly rows={2} id="message" className="form-control mb-3" value={tempOrder.message ?? ''} />
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
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminOrderModal;
