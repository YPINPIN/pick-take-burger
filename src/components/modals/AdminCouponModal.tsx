import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import { useForm } from 'react-hook-form';

import type { CouponData, CreateCouponParams } from '@/types/coupon';
import type { SubmitHandler } from 'react-hook-form';
import type { AdminCouponModalType, AdminCouponModalHandle, AdminCouponModalProps } from '@/types/modal';
import type { ApiError } from '@/types/error';

import useToast from '@/hooks/useToast';
import { apiAdminCreateCoupon, apiAdminEditCoupon } from '@/api/admin.coupon';
import { formatCouponDueDate, toTaiwanEndOfDayTimestamp } from '@/utils/date';

// form 型別
type CouponForm = Omit<CouponData, 'is_enabled' | 'due_date'> & {
  // for checkbox, use boolean type
  is_enabled: boolean;
  // for date input, use string type
  due_date: string;
};

// 初始資料 (API payload 用)
const createInitCouponData = (): CouponData => ({
  id: '',
  title: '',
  code: '',
  is_enabled: 0,
  percent: 100,
  due_date: Math.floor(Date.now() / 1000),
});

// 取得今日日期 (格式化為 YYYY-MM-DD，適用於 date input 的 value)
const getTodayDate = () => formatCouponDueDate(Math.floor(Date.now() / 1000), true);

const AdminCouponModal = forwardRef<AdminCouponModalHandle, AdminCouponModalProps>(function AdminCouponModal({ onSuccess }, ref) {
  const { toastSuccess, toastError } = useToast();

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bsModal = useRef<Modal | null>(null); // 存 Bootstrap Modal instance
  // Modal 類型 (新增 or 編輯)
  const [modalType, setModalType] = useState<AdminCouponModalType>('create');

  // 表單管理
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponForm>({
    defaultValues: {
      id: '',
      title: '',
      code: '',
      is_enabled: false,
      percent: 100,
      due_date: getTodayDate(),
    },
  });

  // 初始化 Modal
  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new Modal(modalRef.current);
    }

    return () => {
      bsModal.current?.dispose();
    };
  }, []);

  const open = useCallback(
    (coupon: CouponData | null = null) => {
      // 設定 Modal 類型
      if (!coupon) {
        coupon = createInitCouponData();
        setModalType('create');
      } else {
        setModalType('edit');
      }

      // 設定表單優惠券資料
      reset({
        ...coupon,
        is_enabled: coupon.is_enabled ? true : false,
        due_date: formatCouponDueDate(coupon.due_date, true),
      });
      bsModal.current?.show();
    },
    [reset],
  );

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

  // 執行優惠券新增或更新
  const executeCouponMutation = async (apiFn: () => Promise<{ success: boolean; message: string }>) => {
    setIsUpdating(true);
    try {
      const data = await apiFn();
      toastSuccess(data.message);
      // 關閉 Modal
      close();
      // 通知父層刪除成功
      onSuccess();
    } catch (error) {
      const err = error as ApiError;
      toastError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 新增優惠券
  const handleCreateCoupon = (couponData: CreateCouponParams) => executeCouponMutation(() => apiAdminCreateCoupon(couponData));

  // 編輯優惠券
  const handleUpdateCoupon = (id: string, couponData: CreateCouponParams) => executeCouponMutation(() => apiAdminEditCoupon({ id, data: couponData }));

  // 提交優惠券資料
  const handleSubmitCoupon: SubmitHandler<CouponForm> = (formData: CouponForm) => {
    // 取出 id, is_enabled, due_date 與其他優惠券資料
    const { id, is_enabled, due_date, ...rest } = formData;
    const couponData: CreateCouponParams = {
      ...rest,
      // is_enabled 轉回 0 或 1
      is_enabled: is_enabled ? 1 : 0,
      // due_date 轉回 timestamp (當天的晚上 23:59:59)
      due_date: toTaiwanEndOfDayTimestamp(due_date),
    };

    if (modalType === 'create') {
      handleCreateCoupon(couponData);
    } else {
      handleUpdateCoupon(id, couponData);
    }
  };

  return (
    <div ref={modalRef} className="modal fade" id="couponModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel">
      <div className="modal-custom-xl modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h3 className="modal-title fs-5 fw-bold" id="staticBackdropLabel">
              <i className="bi bi-pencil-square me-2"></i>
              {modalType === 'create' ? '新增' : '編輯'}優惠券
            </h3>
            <button type="button" className="btn-close btn-close-white" onClick={close} disabled={isUpdating}></button>
          </div>
          <div className="modal-body">
            <form id="couponForm" onSubmit={handleSubmit(handleSubmitCoupon)} className="text-primary">
              <fieldset disabled={isUpdating}>
                <div className="row g-2">
                  <div className="col-12">
                    <label htmlFor="title" className="fw-medium mb-2">
                      優惠券名稱<span className="small text-muted ms-1">(最多 12 個字)</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      className={`form-control mb-2 ${errors.title ? 'is-invalid' : ''}`}
                      placeholder="請輸入優惠券名稱..."
                      {...register('title', {
                        required: '請輸入優惠券名稱',
                        maxLength: {
                          value: 12,
                          message: '最多 12 個字',
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.title?.message}</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="code" className="fw-medium mb-2">
                      優惠碼<span className="small text-muted ms-1">(最多 20 個字)</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      className={`form-control mb-2 ${errors.code ? 'is-invalid' : ''}`}
                      placeholder="請輸入優惠碼..."
                      {...register('code', {
                        required: '請輸入優惠碼',
                        maxLength: {
                          value: 20,
                          message: '最多 20 個字',
                        },
                      })}
                    />
                    <div className="invalid-feedback">{errors.code?.message}</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="percent" className="fw-medium mb-2">
                      折扣百分比<span className="small text-muted ms-1">(0 ~ 100， 80 即為 8 折)</span>
                    </label>
                    {/* 提示文字 */}
                    <div className="small text-secondary mb-2">
                      <i className="bi bi-info-circle me-1"></i>
                      請設定 5 的倍數（如 65、75、80），確保套用優惠券後金額不會出現小數點
                    </div>
                    <input
                      type="number"
                      id="percent"
                      className={`form-control mb-2 ${errors.percent ? 'is-invalid' : ''}`}
                      placeholder="請輸入折扣百分比..."
                      {...register('percent', {
                        required: '請輸入折扣',
                        min: {
                          value: 0,
                          message: '最小為 0',
                        },
                        max: {
                          value: 100,
                          message: '最大為 100',
                        },
                        valueAsNumber: true,
                        validate: (value) => value % 5 === 0 || '請輸入 5 的倍數（如 65、70、75、80），避免折扣後出現小數點',
                      })}
                    />
                    <div className="invalid-feedback">{errors.percent?.message}</div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="due_date" className="fw-medium mb-2">
                      優惠券到期日<span className="small text-muted ms-1">(日期當天的 23:59:59)</span>
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      className={`form-control mb-2 ${errors.due_date ? 'is-invalid' : ''}`}
                      {...register('due_date', {
                        required: '請選擇到期日',
                      })}
                    />
                    <div className="invalid-feedback">{errors.due_date?.message}</div>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input id="is_enabled" type="checkbox" className="form-check-input" role="switch" {...register('is_enabled')} />
                      <label htmlFor="is_enabled" className="form-check-label fw-medium">
                        優惠券狀態 (是否啟用)
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-gray-500 fw-medium px-5 py-2" onClick={close} disabled={isUpdating}>
              取消
            </button>
            <button type="submit" form="couponForm" className="btn btn-accent text-gray-900 fw-bold px-5 py-2" disabled={isUpdating}>
              {isUpdating ? (modalType === 'create' ? '新增中...' : '儲存中...') : `確認${modalType === 'create' ? '新增' : '儲存'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminCouponModal;
