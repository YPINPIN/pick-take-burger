import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import type { ApiError } from '@/types/error';
import type { CartInfo } from '@/types/cart';
import type { CheckoutFormData, CreateOrderParams } from '@/types/order';
import type { SubmitHandler } from 'react-hook-form';
import type { GlobalOverlayState } from '@/types/globalOverlay';
import type { CheckoutSuccessModalHandle, CheckoutSuccessModalData } from '@/types/modal';

import { apiClientGetCartInfo } from '@/api/client.cart';
import { apiClientCreateOrder } from '@/api/client.order';

import OrderSummary from '@/components/OrderSummary';
import CheckoutSuccessModal from '@/components/modals/CheckoutSuccessModal';
import GlobalOverlay from '@/components/GlobalOverlay';

function Checkout() {
  const navigate = useNavigate();
  // 購物車資料
  const [cart, setCart] = useState<CartInfo | null>();
  // 用來判斷是否為最新請求
  const requestId = useRef<number>(0);

  const formRef = useRef<HTMLFormElement | null>(null);
  // 表單資料
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    mode: 'onChange',
  });

  // Checkout Success Modal
  const checkoutSuccessModalRef = useRef<CheckoutSuccessModalHandle>(null);

  // Overlay 顯示狀態 (fetch 狀態)
  const [overlayState, setOverlayState] = useState<GlobalOverlayState>({ isOverlay: false, message: '' });

  // 取得購物車資料
  const fetchCartInfo = async () => {
    setOverlayState({ isOverlay: true });
    const currentRequest: number = ++requestId.current;
    try {
      const data = await apiClientGetCartInfo();
      // 如果不是最新的請求就不更新
      if (currentRequest !== requestId.current) {
        // console.log('不是最新的請求', currentRequest, requestId.current);
        return;
      }
      setCart(data.data);
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

  // 送出訂單
  const handleCheckout: SubmitHandler<CheckoutFormData> = async (formData) => {
    try {
      setOverlayState({ isOverlay: true, message: '送出訂單中...' });
      const { message, ...user } = formData;
      const apiParams: CreateOrderParams = {
        user,
        message,
      };
      const data = await apiClientCreateOrder(apiParams);
      toast.success(data.message);
      // 開啟 Checkout Success Modal
      openCheckoutSuccessModal({ orderId: data.orderId, total: data.total });
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    } finally {
      setOverlayState({ isOverlay: false, message: '' });
    }
  };

  // 初始化資料
  useEffect(() => {
    // 取得購物車
    fetchCartInfo();
  }, []);

  useEffect(() => {
    // 當購物車為空時回到購物車頁面
    if (cart && cart.carts.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart, navigate]);

  // 送出訂單
  const onCheckoutClick = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  // 開啟 Checkout Success Modal
  const openCheckoutSuccessModal = async (modalData: CheckoutSuccessModalData) => {
    checkoutSuccessModalRef.current?.open(modalData);
  };

  return (
    <>
      {/* 全域遮罩 */}
      <GlobalOverlay overlayState={overlayState} />
      {/* Checkout Success Modal */}
      <CheckoutSuccessModal ref={checkoutSuccessModalRef} />
      <div className="container-lg">
        <h1 className="fs-2 fw-bold text-dark mb-2">準備完成訂單</h1>
        {cart && cart.carts.length > 0 && (
          <>
            <p className="fs-6 text-gray-600 mb-3">請正確輸入結帳資訊。</p>
            <div className="row g-4 mb-4">
              {/* 結帳資訊 */}
              <div className="col-md-7">
                <form ref={formRef} onSubmit={handleSubmit(handleCheckout)} className="text-primary">
                  <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4">
                    <div className="row g-1">
                      <div className="col-12">
                        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center mb-2">
                          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle me-2" style={{ width: 36, height: 36 }}>
                            1
                          </span>
                          訂購人 (必填)
                        </h3>
                      </div>
                      {/* 姓名 */}
                      <div className="col-12">
                        <label htmlFor="fullname" className="fw-medium mb-1">
                          <i className="bi bi-person me-2"></i>
                          姓名
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className="form-control mb-2"
                          placeholder="請輸入姓名"
                          {...register('name', {
                            required: '請輸入姓名',
                            minLength: {
                              value: 2,
                              message: '姓名至少兩個字',
                            },
                          })}
                        />
                        <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.name ? 'visible' : 'invisible'}`}>{errors.name ? errors.name.message : '提示'}</p>
                      </div>
                      {/* 手機 */}
                      <div className="col-12">
                        <label htmlFor="tel" className="fw-medium mb-1">
                          <i className="bi bi-phone me-2"></i>
                          手機
                        </label>
                        <input
                          type="tel"
                          id="tel"
                          className="form-control mb-2"
                          placeholder="09XXXXXXXX"
                          {...register('tel', {
                            required: '請輸入手機',
                            pattern: {
                              value: /^09\d{8}$/,
                              message: '手機號碼格式不正確',
                            },
                          })}
                        />
                        <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.tel ? 'visible' : 'invisible'}`}>{errors.tel ? errors.tel.message : '提示'}</p>
                      </div>
                      {/* Email */}
                      <div className="col-12">
                        <label htmlFor="email" className="fw-medium mb-1">
                          <i className="bi bi-envelope me-2"></i>
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control mb-2"
                          placeholder="name@example.com"
                          {...register('email', {
                            required: '請輸入 Email',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: 'Email 格式不正確',
                            },
                          })}
                        />
                        <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.email ? 'visible' : 'invisible'}`}>{errors.email ? errors.email.message : '提示'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4">
                    <div className="row g-1">
                      <div className="col-12">
                        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center mb-2">
                          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle me-2" style={{ width: 36, height: 36 }}>
                            2
                          </span>
                          送餐資訊 (必填)
                        </h3>
                      </div>
                      {/* 地址 */}
                      <div className="col-12">
                        <label htmlFor="address" className="fw-medium mb-1">
                          <i className="bi bi-geo-alt me-2"></i>
                          地址
                        </label>
                        <input
                          type="text"
                          id="address"
                          className="form-control mb-2"
                          placeholder="請輸入地址"
                          {...register('address', {
                            required: '請輸入地址',
                          })}
                        />
                        <p className={`fs-7 text-danger text-start px-3 lh-1 mt-1 ${errors.address ? 'visible' : 'invisible'}`}>{errors.address ? errors.address.message : '提示'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4">
                    <div className="row g-1">
                      <div className="col-12">
                        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center mb-2">
                          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle me-2" style={{ width: 36, height: 36 }}>
                            3
                          </span>
                          其他 (選填)
                        </h3>
                      </div>
                      {/* 備註 */}
                      <div className="col-12">
                        <label htmlFor="message" className="fw-medium mb-1">
                          <i className="bi bi-chat-square-text me-2"></i>
                          備註訊息
                        </label>
                        <textarea rows={4} id="message" className="form-control mb-2" placeholder="有任何備註訊息請輸入在此" {...register('message')} />
                      </div>
                    </div>
                  </div>
                </form>
                {/* 底部操作區 */}
                <div className="d-flex justify-content-between align-items-center gap-2">
                  <Link to="/cart" className={`btn btn-primary fw-bold ${overlayState.isOverlay ? 'disabled' : ''}`}>
                    <i className="bi bi-arrow-left me-2"></i>
                    返回購物車
                  </Link>
                </div>
              </div>

              {/* 訂單摘要 */}
              <div className="col-md-5">
                <OrderSummary cart={cart}>
                  {/* 送出訂單 */}
                  <button type="button" className="btn btn-accent btn-lg fw-bold w-100" onClick={onCheckoutClick}>
                    送出訂單
                    <i className="bi bi-cart-check-fill ms-2"></i>
                  </button>
                </OrderSummary>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Checkout;
