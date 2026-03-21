import type { OrderData, OrderStatus, DisplayStatus, StatusTimestamps } from '@/types/order';
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

// 取得狀態完成時間，UI_ORDER_STATUS (已付款、待接單) 為特殊狀態另外取 (create_at、paid_date)
export const getStatusTime = (order: OrderData, status: DisplayStatus): number | undefined => {
  switch (status) {
    case UI_ORDER_STATUS.PAYMENT_PENDING:
      return order.create_at;

    case UI_ORDER_STATUS.PAYMENT_DONE:
      return order.paid_date;

    default:
      return order.statusTimestamps?.[status as OrderStatus];
  }
};

// 後端狀態更新時，記錄狀態更新時間 (有跳過的狀態則用 now 補齊)
export const getStatusTimestamps = (order: OrderData, newStatus: OrderStatus, now: number): StatusTimestamps => {
  // 目前已完成的狀態
  const doneStatus = order.status;
  // 目前記錄的狀態時間
  const timestamps: StatusTimestamps = {
    ...(order.statusTimestamps ?? {}),
  };

  // 當更新為取消狀態時（獨立處理）
  if (newStatus === ORDER_STATUS.CANCELED) {
    return {
      ...timestamps,
      [ORDER_STATUS.CANCELED]: timestamps[ORDER_STATUS.CANCELED] ?? now,
    };
  }

  // 取得目前已完成的狀態的順序
  const doneIdx = doneStatus && ORDER_STATUS_FLOW.includes(doneStatus) ? ORDER_STATUS_FLOW.indexOf(doneStatus) : -1;
  // 取得新狀態的順序
  const newIdx = ORDER_STATUS_FLOW.indexOf(newStatus);

  // 新狀態不在流程內 or 為重複狀態 or 狀態倒退，不做任何處理
  if (newIdx === -1 || doneStatus === newStatus || doneIdx > newIdx) {
    // console.log('不做任何處理:', timestamps);
    return timestamps;
  }

  // 補齊已完成的狀態
  for (let i = doneIdx + 1; i <= newIdx; i++) {
    const status = ORDER_STATUS_FLOW[i];
    // 如果沒有該狀態的記錄（用 now 補齊）
    if (!timestamps[status]) {
      timestamps[status] = now;
    }
  }

  return timestamps;
};
