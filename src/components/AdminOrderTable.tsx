import type { OrderData } from '@/types/order';

import { formatDate } from '@/utils/date';
import { resolveDisplayStatus } from '@/utils/orderStatus';

import OrderStatusBadge from '@/components/OrderStatusBadge';

type AdminOrderTableProps = {
  orders: OrderData[];
  handleViewOrderClick: (order: OrderData) => void;
  handleDeleteOrderClick: (order: OrderData) => void;
};

function AdminOrderTable({ orders, handleViewOrderClick, handleDeleteOrderClick }: AdminOrderTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped mb-0 align-middle text-nowrap">
        <thead className="table-primary">
          <tr>
            <th scope="col" className="text-center">
              訂單狀態
            </th>
            <th scope="col">訂單編號</th>
            <th scope="col">下單日期</th>
            <th scope="col">總金額</th>
            <th scope="col" className="text-center">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const displayStatus = resolveDisplayStatus(order);
            return (
              <tr key={order.id}>
                <td className="text-center">
                  <OrderStatusBadge displayStatus={displayStatus} />
                </td>
                <td className="text-primary fw-bold">{order.id}</td>
                <td className="text-secondary">{formatDate(order.create_at)}</td>
                <td className="text-danger fw-bold">NT${order.total}</td>
                <td className="text-center">
                  <button onClick={() => handleViewOrderClick(order)} type="button" className="btn btn-sm btn-secondary rounded-2 me-2">
                    <i className="bi bi-eye me-1"></i>
                    詳情
                  </button>
                  <button type="button" className="btn btn-sm btn-danger rounded-2" onClick={() => handleDeleteOrderClick(order)}>
                    <i className="bi bi-trash3-fill me-1" />
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderTable;
