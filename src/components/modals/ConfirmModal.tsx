import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'bootstrap';

import type { ConfirmModalData, ConfirmModalHandle, ConfirmModalProps } from '@/types/modal';

const MODAL_Z_INDEX = 1065;
const BACKDROP_Z_INDEX = 1060;

const ConfirmModal = forwardRef<ConfirmModalHandle, ConfirmModalProps>(function ConfirmModal(_, ref) {
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // Backdrop
  const backdropRef = useRef<HTMLDivElement | null>(null);
  // Modal 資料
  const [modalData, setModalData] = useState<ConfirmModalData>({ title: '刪除' });

  // 初始化 Modal
  useEffect(() => {
    if (!modalRef.current) return;

    // 設定 modal z-index
    modalRef.current.style.zIndex = String(MODAL_Z_INDEX);

    bsModal.current = new Modal(modalRef.current, { backdrop: false });
    const el = modalRef.current;

    // 自訂 backdrop
    const backdrop = document.createElement('div');
    backdropRef.current = backdrop;

    const handleShow = () => {
      backdrop.className = 'modal-backdrop fade';
      backdrop.style.zIndex = String(BACKDROP_Z_INDEX);
      document.body.appendChild(backdrop);
      requestAnimationFrame(() => {
        backdrop.classList.add('show');
      });
    };

    const handleHide = () => {
      backdrop.classList.remove('show');
      backdrop.addEventListener(
        'transitionend',
        () => {
          backdrop.remove();
        },
        { once: true },
      );
    };

    const handleClick = (e: MouseEvent) => {
      if (e.target === el) {
        if (el.classList.contains('modal-static')) {
          // 動畫中直接 return
          return;
        }
        el.classList.add('modal-static');
        setTimeout(() => {
          el.classList.remove('modal-static');
        }, 300);
      }
    };

    el.addEventListener('show.bs.modal', handleShow);
    el.addEventListener('hide.bs.modal', handleHide);
    el.addEventListener('click', handleClick);

    return () => {
      el.removeEventListener('show.bs.modal', handleShow);
      el.removeEventListener('hide.bs.modal', handleHide);
      el.removeEventListener('click', handleClick);
      backdrop.remove();
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
    <div ref={modalRef} className="modal fade" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
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
