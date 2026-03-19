import type { ProductData } from '@/types/product';
import type { OrderData } from '@/types/order';

// ----------------------------------------
// Product Modal 相關類型
// ----------------------------------------

// 定義 Product Modal 的類型 (新增或編輯)
export type AdminProductModalType = 'create' | 'edit';

// 定義 Product Modal 對外暴露的 API
export type AdminProductModalHandle = {
  open: (data: ProductData | null) => void;
  close: () => void;
};

// 定義 Product Modal props
export type AdminProductModalProps = {
  onSuccess: () => void;
};

// ----------------------------------------
// Order Modal 相關類型
// ----------------------------------------

// 定義 Order Modal 對外暴露的 API
export type AdminOrderModalHandle = {
  open: (data: OrderData) => void;
  close: () => void;
};

// 定義 Order Modal props
export type AdminOrderModalProps = {
  onSuccess: () => void;
};

// ----------------------------------------
// Delete Modal 相關類型
// ----------------------------------------

// 定義可刪除的類型
export type AdminDeleteModalType = 'product' | 'order';

// 定義 Delete Modal 資料結構
export type AdminDeleteModalData = {
  id: string;
  title: string;
  type: AdminDeleteModalType;
};

// 定義 Delete Modal 對外暴露的 API
export type AdminDeleteModalHandle = {
  open: (data: AdminDeleteModalData) => void;
  close: () => void;
};

// 定義 Delete Modal props
export type AdminDeleteModalProps = {
  onSuccess: () => void;
};

// ----------------------------------------
// Confirm Modal 相關類型
// ----------------------------------------

// 定義 Confirm Modal 資料結構
// title: 確認內容
// message: 額外說明
export type ConfirmModalData = {
  title: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

// 定義 Confirm Modal 對外暴露的 API
export type ConfirmModalHandle = {
  open: (data: ConfirmModalData) => void;
  close: () => void;
};

// 定義 Confirm Modal props
export type ConfirmModalProps = Record<never, never>;

// ----------------------------------------
// CheckoutSuccess Modal 相關類型
// ----------------------------------------

// 定義 CheckoutSuccess Modal 資料結構
// orderId: 訂單編號
// total: 總金額
export type CheckoutSuccessModalData = {
  orderId: string;
  total: number;
};

// 定義 CheckoutSuccess Modal 對外暴露的 API
export type CheckoutSuccessModalHandle = {
  open: (data: CheckoutSuccessModalData) => void;
};

// 定義 CheckoutSuccess Modal props
export type CheckoutSuccessModalProps = Record<never, never>;
