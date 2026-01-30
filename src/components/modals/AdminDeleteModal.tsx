import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';

import type { AdminDeleteModalType, AdminDeleteModalData, AdminDeleteModalHandle, AdminDeleteModalProps } from '@/types/modal';
import type { ApiError } from '@/types/error';

import { apiAdminDeleteProduct } from '@/api/admin.product';

const typeLabelMap: Record<AdminDeleteModalType, string> = {
  product: '產品',
};

const deleteApiMap: Record<AdminDeleteModalType, (id: string) => Promise<{ success: boolean; message: string }>> = {
  product: apiAdminDeleteProduct,
};

const AdminDeleteModal = forwardRef<AdminDeleteModalHandle, AdminDeleteModalProps>(function AdminDeleteModal({ onSuccess }, ref) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // 刪除暫存資料
  const [tempDeleteData, setTempDeleteData] = useState<AdminDeleteModalData>({ id: '', title: '', type: 'product' });

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  const open = useCallback((data: AdminDeleteModalData) => {
    setTempDeleteData(data);
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

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const { id, type } = tempDeleteData;
      // 根據 type 呼叫不同的刪除 API
      const data = await deleteApiMap[type](id);
      toast.success(data.message);
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
    <div ref={modalRef} className="modal fade" id="productDeleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-primary text-center mb-4">
              <span className="p-3 d-inline-block bg-danger bg-opacity-25 rounded-circle mb-4">
                <i className="bi bi-exclamation-triangle-fill fs-1 lh-1 text-danger"></i>
              </span>
              <p className="text-dark fs-5 fw-bold mb-2">確定要刪除此{typeLabelMap[tempDeleteData.type]}嗎？</p>
              <p className="fs-6 text-secondary mb-1">刪除後將無法復原，確定要刪除{typeLabelMap[tempDeleteData.type]}</p>
              <p className="fs-6 text-secondary">
                「<span className="text-dark fw-bold">{tempDeleteData.title}</span>」嗎？
              </p>
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-outline-gray-500 text-primary  fw-medium px-5 py-2 w-50" onClick={close} disabled={isUpdating}>
                取消
              </button>
              <button type="button" onClick={handleDelete} className="btn btn-danger fw-bold px-5 py-2 w-50" disabled={isUpdating}>
                {isUpdating ? '刪除中...' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminDeleteModal;
