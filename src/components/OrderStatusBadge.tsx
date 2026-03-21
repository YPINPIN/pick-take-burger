import { useMemo } from 'react';

import type { DisplayStatus } from '@/types/order';

import { ORDER_STATUS_META } from '@/utils/orderStatus';

type OrderStatusBadgeProps = {
  displayStatus: DisplayStatus;
};

function OrderStatusBadge({ displayStatus }: OrderStatusBadgeProps) {
  const statusInfo = useMemo(() => ORDER_STATUS_META[displayStatus], [displayStatus]);

  return (
    <span className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 text-white bg-${statusInfo.color}`}>
      <i className={`bi bi-${statusInfo.icon}`} />
      {statusInfo.label}
    </span>
  );
}

export default OrderStatusBadge;
