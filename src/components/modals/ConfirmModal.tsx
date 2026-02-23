import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'bootstrap';

import type { ConfirmModalData, ConfirmModalHandle, ConfirmModalProps } from '@/types/modal';

const ConfirmModal = forwardRef<ConfirmModalHandle, ConfirmModalProps>(function ConfirmModal(_, ref) {
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // Modal 資料
  const [modalData, setModalData] = useState<ConfirmModalData>({ title: '刪除' });

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  const open = useCallback((data: ConfirmModalData) => {
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

  // 確定
  const handleConfirm = useCallback(() => {
    modalData.onConfirm?.();
    close();
  }, [modalData, close]);

  // 取消
  const handleCancel = useCallback(() => {
    modalData.onCancel?.();
    close();
  }, [modalData, close]);

  return (
    <div ref={modalRef} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-primary text-center mb-4">
              <span className="p-3 d-inline-block bg-danger bg-opacity-25 rounded-circle mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-1 lh-1 text-danger"></i>
              </span>
              <p className="text-dark fs-5 fw-bold mb-2">
                確定要<span className="fw-bold">{modalData.title}</span>嗎？
              </p>
              {modalData.message && <p className="fs-6 text-secondary">{modalData.message}</p>}
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-outline-gray-500 text-primary fw-medium px-5 py-2 w-50" onClick={handleCancel}>
                取消
              </button>
              <button type="button" onClick={handleConfirm} className="btn btn-danger fw-bold px-5 py-2 w-50">
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ConfirmModal;
