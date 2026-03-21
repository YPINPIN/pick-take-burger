import type { OrderData, OrderStatus, DisplayStatus } from '@/types/order';
import { ORDER_STATUS, UI_ORDER_STATUS } from '@/types/order';

// 訂單狀態 UI 顯示配置
export const ORDER_STATUS_META: Record<DisplayStatus, { label: string; color: string; icon: string }> = {
  payment_pending: { label: '待付款', color: 'payment-pending', icon: 'wallet-fill' },
  payment_done: { label: '待接單', color: 'payment-done', icon: 'hourglass-split' },
  pending: { label: '已接單', color: 'pending', icon: 'receipt' },
  preparing: { label: '製作中', color: 'preparing', icon: 'fire' },
  delivering: { label: '外送中', color: 'delivering', icon: 'bicycle' },
  delivered: { label: '已送達', color: 'delivered', icon: 'house-check' },
  canceled: { label: '已取消', color: 'canceled', icon: 'x-lg' },
};

// ---- 流程順序 for select（只放真實後端狀態）----
// ( 待接單 -> 製作中 -> 外送中 -> 已送達)
export const ORDER_STATUS_FLOW: OrderStatus[] = [ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED];

/**
 * 根據 order 資料解析 UI 顯示狀態
 * - 未付款              → payment_pending
 * - 已付款、status 為空 → payment_done（等待後台接單）
 * - 其他               → order.status
 */
export const resolveDisplayStatus = (order: OrderData): DisplayStatus => {
  if (!order.is_paid) return UI_ORDER_STATUS.PAYMENT_PENDING;
  if (!order.status) return UI_ORDER_STATUS.PAYMENT_DONE;
  return order.status;
};

// 根據 order 資料解析 select 可選的下一個狀態
export const getAvailableNextStatuses = (order: OrderData): OrderStatus[] => {
  const current = resolveDisplayStatus(order);

  // 未付款 or 已完成/已取消 → 不可操作
  if (current === UI_ORDER_STATUS.PAYMENT_PENDING) return [];
  if (current === ORDER_STATUS.DELIVERED || current === ORDER_STATUS.CANCELED) return [];

  // 已付款待接單 → 全部都可操作
  if (current === UI_ORDER_STATUS.PAYMENT_DONE) {
    return [...ORDER_STATUS_FLOW, ORDER_STATUS.CANCELED];
  }

  const idx = ORDER_STATUS_FLOW.indexOf(current as OrderStatus);
  // 若找不到對應流程順序 → 不可操作
  if (idx === -1) return [];
  // 根據流程順序取得可用的下一步狀態
  return [...ORDER_STATUS_FLOW.slice(idx + 1), ORDER_STATUS.CANCELED];
};
