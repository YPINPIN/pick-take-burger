import type { OrderData } from '@/types/order';

import OrderProgressBar from '@/components/OrderProgressBar';

type TrackOrderProgressPanelProps = {
  order: OrderData;
};

function TrackOrderProgressPanel({ order }: TrackOrderProgressPanelProps) {
  return (
    <div className="row">
      <div className="col-12">
        <h3 className="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
          <span className="bg-accent d-flex align-items-center justify-content-center rounded-circle" style={{ width: 36, height: 36 }}>
            <i className="bi bi-arrow-repeat"></i>
          </span>
          訂單狀態
        </h3>
      </div>
      <div className="col-12">
        <OrderProgressBar order={order} />
      </div>
    </div>
  );
}

export default TrackOrderProgressPanel;
