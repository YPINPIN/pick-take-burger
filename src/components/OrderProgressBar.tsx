import type { OrderData, DisplayStatus } from '@/types/order';
import { UI_ORDER_STATUS, ORDER_STATUS } from '@/types/order';

import { ORDER_STATUS_META, resolveDisplayStatus, getStatusTime } from '@/utils/orderStatus';
import { formatStatusDate, formatStatusTime } from '@/utils/date';

// ProgressBar 步驟順序
const PROGRESS_FLOW: DisplayStatus[] = [UI_ORDER_STATUS.PAYMENT_PENDING, UI_ORDER_STATUS.PAYMENT_DONE, ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.DELIVERING, ORDER_STATUS.DELIVERED];

// 步驟 State
type StepState = 'done' | 'active' | 'upcoming' | 'done-cancelled' | 'cancelled';
// 步驟
type Step = { stepKey: DisplayStatus; state: StepState; time?: number | undefined };

// 根據 order 資料建立步驟
function buildSteps(order: OrderData): Step[] {
  const current = resolveDisplayStatus(order);

  // 如果已取消
  if (current === ORDER_STATUS.CANCELED) {
    // 取得取消的步驟
    const cancelledAt: DisplayStatus = order.cancelledAt ?? UI_ORDER_STATUS.PAYMENT_DONE;
    const cutIdx = PROGRESS_FLOW.indexOf(cancelledAt);
    return [
      ...PROGRESS_FLOW.slice(0, cutIdx + 1).map((stepKey) => ({
        stepKey,
        state: 'done-cancelled' as StepState,
        time: getStatusTime(order, stepKey),
      })),
      { stepKey: ORDER_STATUS.CANCELED, state: 'cancelled' as StepState, time: getStatusTime(order, ORDER_STATUS.CANCELED) },
    ];
  }
  // 根據目前狀態取得步驟
  const currentIdx = PROGRESS_FLOW.indexOf(current);
  return PROGRESS_FLOW.map((stepKey, i) => ({
    stepKey,
    state: (i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'upcoming') as StepState,
    time: getStatusTime(order, stepKey),
  }));
}

// 步驟圓點
function StepDot({ stepKey, state }: Step) {
  const meta = ORDER_STATUS_META[stepKey];

  // done → check icon；其餘用 meta.icon
  const icon = state === 'done' ? 'check-lg' : meta.icon;

  return (
    <div className={`step-dot step-dot--${state}`}>
      <i className={`bi bi-${icon}`} />
    </div>
  );
}

// 步驟標題
function StepLabel({ stepKey, state, time }: Step) {
  const meta = ORDER_STATUS_META[stepKey];

  return (
    <div className="text-center">
      <div className={`step-label step-label--${state}`}>{state === 'cancelled' ? '已取消' : meta.label}</div>
      {time && (
        <div className="step-time text-muted small lh-1">
          <div className="mt-1">{formatStatusDate(time)}</div>
          <div className="mt-1">{formatStatusTime(time)}</div>
        </div>
      )}
    </div>
  );
}

// 步驟 connector
function StepConnector({ leftState }: { leftState: StepState }) {
  return (
    <div
      className={`
        step-connector
        step-connector--${leftState}
      `}
    />
  );
}

type OrderProgressBarProps = {
  order: OrderData;
};

export function OrderProgressBar({ order }: OrderProgressBarProps) {
  const steps = buildSteps(order);

  return (
    <div className="order-progress">
      <div className="order-progress-inner">
        {steps.map((step, i) => {
          return (
            <div key={step.stepKey} className={`order-step text-${ORDER_STATUS_META[step.stepKey].color}`}>
              <div className="order-step-col">
                <StepDot stepKey={step.stepKey} state={step.state} />
                <StepLabel stepKey={step.stepKey} state={step.state} time={step.time} />
              </div>
              {!(i === steps.length - 1) && <StepConnector leftState={step.state} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderProgressBar;
