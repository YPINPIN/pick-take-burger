import { useEffect, useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import type { ChangeEvent } from 'react';
import type { ApiError } from '@/types/error';
import type { Pagination } from '@/types/pagination';
import type { OrderData } from '@/types/order';
import type { AdminOrderModalHandle, AdminDeleteModalHandle } from '@/types/modal';

import { apiAdminGetOrders } from '@/api/admin.order';
import { apiClientGetOrder } from '@/api/client.order';

import LoadingSpinner from '@/components/LoadingSpinner';
import PaginationUI from '@/components/PaginationUI';
import AdminOrderTable from '@/components/AdminOrderTable';
import AdminOrderModal from '@/components/modals/AdminOrderModal';
import AdminDeleteModal from '@/components/modals/AdminDeleteModal';

function OrderManagement() {
  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);
  // 全部訂單資料
  const [orders, setOrders] = useState<OrderData[]>([]);
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

  // 是否點擊搜尋(切換搜尋顯示)
  const [hasSearched, setHasSearched] = useState(false);
  // 搜尋 order id
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  // 搜尋到的訂單結果
  const [searchOrder, setSearchOrder] = useState<OrderData | null>(null);

  // 訂單詳情 Modal
  const orderModalRef = useRef<AdminOrderModalHandle>(null);
  // 刪除 Modal
  const deleteModalRef = useRef<AdminDeleteModalHandle>(null);

  // 取得產品列表（根據 page + category）
  const fetchOrders = useCallback(async () => {
    // 紀錄請求次數
    const currentRequest: number = ++requestId.current;

    setIsLoading(true);
    try {
      const data = await apiAdminGetOrders({
        page: currentPage.toString(),
      });

      // 如果不是最新的請求就不更新
      if (currentRequest !== requestId.current) {
        // console.log('不是最新的請求', currentRequest, requestId.current);
        return;
      }

      setOrders(data.orders);
      setPagination(data.pagination);
      // 同步當前頁面狀態
      if (currentPage !== data.pagination.current_page) {
        setCurrentPage(data.pagination.current_page);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      if (currentRequest === requestId.current) {
        // 如果是最新的請求就關閉 loading
        setIsLoading(false);
      }
    }
  }, [currentPage]);

  // 搜尋指定 Order 資料
  const fetchOrderById = async (orderId: string) => {
    setIsLoading(true);
    try {
      const data = await apiClientGetOrder(orderId);
      setSearchOrder(data.order);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 查看訂單
  const handleViewOrderClick = (order: OrderData) => {
    orderModalRef.current?.open(order);
  };

  // 刪除訂單
  const handleDeleteOrderClick = (order: OrderData) => {
    deleteModalRef.current?.open({
      id: order.id,
      title: order.id,
      type: 'order',
    });
  };

  // 更新訂單成功後的回調 (Modal 不關閉)
  const handleUpdateOrderSuccess = () => {
    // 如果有搜尋
    if (searchOrderId) {
      fetchOrderById(searchOrderId);
      fetchOrders();
    } else {
      // 清空搜尋
      setSearchOrderId('');
      setSearchOrder(null);
      // 回到列表模式
      setHasSearched(false);
      fetchOrders(); // 更新產品列表
    }
  };

  // 刪除訂單成功後的回調
  const handleDeleteOrderSuccess = () => {
    // 清空搜尋
    setSearchOrderId('');
    setSearchOrder(null);
    // 回到列表模式
    setHasSearched(false);
    fetchOrders(); // 更新產品列表
  };

  // 處理搜尋 input 變更
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 清空搜尋
    if (value === '') {
      setSearchOrder(null);
      // 回到列表模式
      setHasSearched(false);
    }

    setSearchOrderId(value);
  };

  // 進行搜尋
  const handleSearch = () => {
    if (searchOrderId) {
      setHasSearched(true);
      fetchOrderById(searchOrderId);
    }
  };

  // 取得訂單列表
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <>
      {/* Order Management */}
      <section>
        <div className="bg-white border border-light rounded-3 shadow-lg overflow-hidden">
          {/* 搜尋 */}
          <div className="p-4 d-flex flex-column flex-sm-row gap-3 align-items-stretch justify-content-sm-between align-items-sm-center">
            <input type="search" className="form-control" id="floatingOrderId" placeholder="輸入訂單編號查詢..." autoComplete="off" value={searchOrderId} onChange={handleSearchInputChange} disabled={isLoading} />
            <button type="button" className="btn btn-accent text-gray-900 fw-bold px-3 py-2" onClick={handleSearch} disabled={!searchOrderId || isLoading}>
              <i className="bi bi-search"></i>
            </button>
          </div>

          {isLoading ? (
            // 載入中
            <div className="p-4 pt-0 d-flex justify-content-center align-items-center">
              <LoadingSpinner />
            </div>
          ) : hasSearched && searchOrder ? (
            // 顯示查詢結果
            <div className="mb-6">
              <AdminOrderTable orders={[searchOrder]} handleViewOrderClick={handleViewOrderClick} handleDeleteOrderClick={handleDeleteOrderClick} />
            </div>
          ) : hasSearched && !searchOrder ? (
            // 顯示查無此訂單
            <div className="text-center px-4 pb-6">
              <p className="fs-3 text-gray-600">
                <i className="bi bi-emoji-smile-upside-down-fill me-2"></i>查無訂單資料
              </p>
            </div>
          ) : orders.length > 0 ? (
            <>
              {/* 顯示訂單列表 */}
              <AdminOrderTable orders={orders} handleViewOrderClick={handleViewOrderClick} handleDeleteOrderClick={handleDeleteOrderClick} />
              {/* 分頁 */}
              <PaginationUI total_pages={pagination.total_pages} has_pre={pagination.has_pre} has_next={pagination.has_next} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </>
          ) : (
            // 訂單列表為空
            <div className="text-center px-4 pb-4">
              <p className="fs-3 text-primary">目前沒有訂單</p>
            </div>
          )}
        </div>
      </section>
      {/* Order Modal */}
      <AdminOrderModal ref={orderModalRef} onSuccess={handleUpdateOrderSuccess} />
      {/* Delete Modal */}
      <AdminDeleteModal ref={deleteModalRef} onSuccess={handleDeleteOrderSuccess} />
    </>
  );
}

export default OrderManagement;
