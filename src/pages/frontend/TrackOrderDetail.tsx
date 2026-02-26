import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { OrderData } from '@/types/order';
import type { CartData } from '@/types/cart';
import type { GlobalOverlayState } from '@/types/globalOverlay';

import { apiClientGetOrder } from '@/api/client.order';
import { apiClientPay } from '@/api/client.pay';

import TrackOrderItem from '@/components/TrackOrderItem';
import GlobalOverlay from '@/components/GlobalOverlay';

function TrackOrderDetail() {
  // url 參數
  const { orderId } = useParams();
  // SearchParams 參數判斷是否為付款步驟
  const [searchParams, setSearchParams] = useSearchParams();
  const queryStepPay = searchParams.get('stepPay');

  // 訂單資料
  const [order, setOrder] = useState<OrderData | null>(null);
  // 訂單商品列表
  const products: CartData[] = useMemo(() => Object.values(order?.products ?? {}), [order]);
  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);

  // 是否為付款步驟
  const [stepPay, setStepPay] = useState<boolean>(false);
  // payment radio 選項選擇狀態
  const [payment, setPayment] = useState<string | null>(null);

  // Overlay 顯示狀態 (fetch 狀態)
  const [overlayState, setOverlayState] = useState<GlobalOverlayState>({ isOverlay: true });

  // 取得 Order 資料
  const fetchOrderDetail = async (orderId: string) => {
    setOverlayState({ isOverlay: true });
    const currentRequest: number = ++requestId.current;
    try {
      const data = await apiClientGetOrder(orderId);
      // 如果不是最新的請求就不更新
      if (currentRequest !== requestId.current) {
        // console.log('不是最新的請求', currentRequest, requestId.current);
        return;
      }
      setOrder(data.order);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      if (currentRequest === requestId.current) {
        // 如果是最新的請求就關閉 loading
        setOverlayState({ isOverlay: false, message: '' });
      }
    }
  };

  // 前往付款
  const goToPayment = () => {
    if (order?.is_paid) {
      return;
    }
    setSearchParams({ stepPay: 'true' });
  };

  // 返回訂單
  const goToOrder = () => {
    setSearchParams({});
    setPayment(null);
  };

  // 處理付款
  const handlePayment = async (orderId: string) => {
    try {
      setOverlayState({ isOverlay: true });
      const data = await apiClientPay(orderId);
      toast.success(data.message);
      await fetchOrderDetail(orderId);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  };

  // 取得訂單資料
  useEffect(() => {
    if (!orderId) return;

    fetchOrderDetail(orderId);
  }, [orderId]);

  // 判斷是否為付款步驟
  useEffect(() => {
    // 如果參數為付款步驟(且確實還沒付款)
    if (queryStepPay === 'true' && !order?.is_paid) {
      setStepPay(true);
    } else {
      setStepPay(false);
    }
  }, [queryStepPay, order?.is_paid, setSearchParams]);

  return (
    <>
      {/* 全域遮罩 */}
      <GlobalOverlay overlayState={overlayState} />
      <section className="py-3">
        {order && (
          <div className="row g-4">
            {/* 訂單內容 */}
            <div className="col-md-7">
              <div className="bg-white rounded-4 shadow-sm px-4 py-4 text-primary">
                <div className="row">
                  <div className="col-12">
                    <h3 className="fs-5 fw-bold text-dark d-flex align-items-center mb-3">
                      <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle me-2" style={{ width: 36, height: 36 }}>
                        <i className="bi bi-bag-check-fill"></i>
                      </span>
                      訂單內容
                    </h3>
                  </div>
                  <div className="col-12">
                    <p className="fs-6 fw-bold text-primary mb-3">
                      訂單編號：<span className="text-success">{order.id}</span>
                    </p>
                    <hr className="my-2" />
                  </div>
                  {/* 訂單列表 */}
                  <div className="col-12">
                    <div className="py-3">
                      {products.map((product, index) => (
                        <div key={`trackOrderItem-${product.id}`}>
                          {index !== 0 && <hr className="dashed-hr my-2" />}
                          <TrackOrderItem item={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 總計 */}
                  <div className="col-12">
                    <hr className="my-2" />
                    <div className="d-flex flex-wrap justify-content-between fs-5 fw-semibold">
                      <span className="text-dark">總計</span>
                      <span className="text-danger">NT${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="custom-sticky-top bg-white rounded-4 shadow-sm px-4 py-4 mb-4 text-primary">
                {/* 1.訂購資訊 */}
                {!stepPay && (
                  <div className="row">
                    <div className="col-12">
                      <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36 }}>
                          <i className="bi bi-person-lines-fill"></i>
                        </span>
                        訂購資訊
                        <span className={`badge fs-6 px-3 py-2 text-bg-${order.is_paid ? 'success' : 'danger'}`}>{order.is_paid ? '已付款' : '尚未付款'}</span>
                      </h3>
                    </div>
                    {/* 姓名 */}
                    <div className="col-12">
                      <label htmlFor="fullname" className="fw-medium mb-1">
                        <i className="bi bi-person me-2"></i>
                        姓名
                      </label>
                      <input disabled readOnly={true} type="text" id="fullname" className="form-control mb-2" value={order.user.name} />
                    </div>
                    {/* 手機 */}
                    <div className="col-12">
                      <label htmlFor="tel" className="fw-medium mb-1">
                        <i className="bi bi-phone me-2"></i>
                        手機
                      </label>
                      <input disabled readOnly type="tel" id="tel" className="form-control mb-2" value={order.user.tel} />
                    </div>
                    {/* Email */}
                    <div className="col-12">
                      <label htmlFor="email" className="fw-medium mb-1">
                        <i className="bi bi-envelope me-2"></i>
                        Email
                      </label>
                      <input disabled readOnly type="email" id="email" className="form-control mb-2" value={order.user.email} />
                    </div>
                    {/* 地址 */}
                    <div className="col-12">
                      <label htmlFor="address" className="fw-medium mb-1">
                        <i className="bi bi-geo-alt me-2"></i>
                        地址
                      </label>
                      <input disabled readOnly type="text" id="address" className="form-control mb-2" value={order.user.address} />
                    </div>
                    {/* 備註 */}
                    <div className="col-12">
                      <label htmlFor="message" className="fw-medium mb-1">
                        <i className="bi bi-chat-square-text me-2"></i>
                        備註訊息
                      </label>
                      <textarea disabled readOnly rows={2} id="message" className="form-control mb-3" value={order.message} />
                    </div>
                    {!order.is_paid && (
                      <div className="col-12">
                        {/* 前往付款 */}
                        <button type="button" className="btn btn-accent btn-lg fw-bold w-100" onClick={goToPayment}>
                          前往付款
                          <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/* 2.選擇付款方式 */}
                {stepPay && !order.is_paid && (
                  <div className="row">
                    <div className="col-12">
                      <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36 }}>
                          <i className="bi bi-wallet-fill"></i>
                        </span>
                        選擇付款方式
                      </h3>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <input type="radio" className="btn-check" name="payment" id="payment-burgerPay" value="burgerPay" checked={payment === 'burgerPay'} onChange={(e) => setPayment(e.target.value)} />
                        <label className="btn btn-outline-dark border-2 d-flex flex-column" htmlFor="payment-burgerPay">
                          <i className="bi bi-credit-card-fill display-2"></i>
                          <span>Burger Pay</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      {/* 立即付款 */}
                      <button type="button" className="btn btn-accent btn-lg fw-bold w-100 mb-2" onClick={() => handlePayment(order.id)} disabled={order.is_paid || !payment}>
                        立即付款
                      </button>
                    </div>
                    <div className="col-12">
                      {/* 立即付款 */}
                      <button type="button" className="btn btn-outline-gray-600 btn-lg fw-bold w-100" onClick={goToOrder}>
                        <i className="bi bi-arrow-left me-2"></i>
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!order && !overlayState.isOverlay && (
          <div className="py-4 d-flex justify-content-center align-items-center">
            <p className="fs-1 text-gray-600">
              <i className="bi bi-emoji-smile-upside-down-fill me-2"></i>
              查無訂單資料
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default TrackOrderDetail;
