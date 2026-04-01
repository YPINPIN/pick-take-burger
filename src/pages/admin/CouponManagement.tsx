import { useEffect, useState, useRef, useCallback } from 'react';

import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { CouponData } from '@/types/coupon';
import type { AdminCouponModalHandle, AdminDeleteModalHandle } from '@/types/modal';

import useToast from '@/hooks/useToast';
import { apiAdminGetCoupons } from '@/api/admin.coupon';
import { formatCouponDueDate } from '@/utils/date';

import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationUI from '@/components/PaginationUI';
import AdminCouponModal from '@/components/modals/AdminCouponModal';
import AdminDeleteModal from '@/components/modals/AdminDeleteModal';

function CouponManagement() {
  const { toastError } = useToast();

  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);
  // 全部優惠券資料
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  // 分頁
  const [pagination, setPagination] = useState<Pagination>({
    total_pages: 0,
    current_page: 0,
    has_pre: false,
    has_next: false,
    category: '',
  });

  // 目前頁面
  const [currentPage, setCurrentPage] = useState<number>(1);

  // fetch 狀態
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // // 優惠券新增/編輯 Modal
  const couponModalRef = useRef<AdminCouponModalHandle>(null);
  // 刪除 Modal
  const deleteModalRef = useRef<AdminDeleteModalHandle>(null);

  // 取得優惠券列表
  const fetchCoupons = useCallback(async () => {
    // 紀錄請求次數
    const currentRequest: number = ++requestId.current;

    setIsLoading(true);
    try {
      const data = await apiAdminGetCoupons({
        page: currentPage.toString(),
      });

      // 如果不是最新的請求就不更新
      if (currentRequest !== requestId.current) {
        // console.log('不是最新的請求', currentRequest, requestId.current);
        return;
      }

      setCoupons(data.coupons);
      setPagination(data.pagination);
      // 同步當前頁面狀態
      if (currentPage !== data.pagination.current_page) {
        setCurrentPage(data.pagination.current_page);
      }
    } catch (error) {
      const err = error as ApiError;
      toastError(err.message);
    } finally {
      if (currentRequest === requestId.current) {
        // 如果是最新的請求就關閉 loading
        setIsLoading(false);
      }
    }
  }, [currentPage, toastError]);

  // 新增優惠券
  const handleAddCouponClick = () => {
    couponModalRef.current?.open(null);
  };

  // 編輯優惠券
  const handleEditCouponClick = (coupon: CouponData) => {
    couponModalRef.current?.open(coupon);
  };

  // 刪除優惠券
  const handleDeleteCouponClick = (coupon: CouponData) => {
    deleteModalRef.current?.open({
      id: coupon.id,
      title: coupon.title,
      type: 'coupon',
    });
  };

  // 更新優惠券成功後的回調
  const handleEditCouponSuccess = () => {
    fetchCoupons(); // 更新優惠券列表
  };

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <>
      {/* Coupon Management */}
      <section>
        <div className="bg-white border border-light rounded-3 shadow-lg overflow-hidden">
          {!isLoading && (
            <div className="p-4 d-flex flex-column flex-sm-row gap-3 align-items-stretch justify-content-sm-end align-items-sm-center">
              <button type="button" onClick={handleAddCouponClick} className="btn btn-accent text-gray-900 fw-bold px-5 py-2">
                <i className="bi bi-plus-circle-fill me-2"></i>
                新增優惠券
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="p-4 d-flex justify-content-center align-items-center">
              <LoadingSpinner />
            </div>
          ) : coupons.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 align-middle text-nowrap">
                  <thead className="table-primary">
                    <tr>
                      <th scope="col">優惠券名稱</th>
                      <th scope="col">優惠碼</th>
                      <th scope="col" className="text-center">
                        折扣百分比
                      </th>
                      <th scope="col">截止日期</th>
                      <th scope="col" className="text-center">
                        啟用
                      </th>
                      <th scope="col" className="text-center">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id}>
                        <td>{coupon.title}</td>
                        <td className="text-primary fw-bold">{coupon.code}</td>
                        <td className="text-danger text-center fw-bold">{coupon.percent}%</td>
                        <td className="text-secondary">{formatCouponDueDate(coupon.due_date)}</td>
                        <td className="text-center">
                          <div className="form-check form-switch d-flex justify-content-center align-items-center">
                            <input className="form-check-input" style={{ pointerEvents: 'none' }} type="checkbox" id="checkNativeSwitch" checked={Boolean(coupon.is_enabled)} readOnly={true} />
                          </div>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleEditCouponClick(coupon)} type="button" className="btn btn-sm btn-secondary rounded-2 me-2">
                            <i className="bi bi-pencil-square me-1" />
                            編輯
                          </button>
                          <button type="button" className="btn btn-sm btn-danger rounded-2" onClick={() => handleDeleteCouponClick(coupon)}>
                            <i className="bi bi-trash3-fill me-1" />
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* 分頁 */}
              <PaginationUI total_pages={pagination.total_pages} has_pre={pagination.has_pre} has_next={pagination.has_next} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </>
          ) : (
            <div className="text-center px-4 pb-4">
              <p className="fs-3 text-primary">目前沒有優惠券</p>
            </div>
          )}
        </div>
      </section>

      {/* Coupon Modal */}
      <AdminCouponModal ref={couponModalRef} onSuccess={handleEditCouponSuccess} />
      {/* Delete Modal */}
      <AdminDeleteModal ref={deleteModalRef} onSuccess={handleEditCouponSuccess} />
    </>
  );
}

export default CouponManagement;
