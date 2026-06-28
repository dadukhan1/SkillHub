import { FC } from "react";

export interface Order {
  _id: string;
  courseId: string;
  userId: string;
  createdAt: string;
  paymentInfo?: Record<string, unknown>;
}

interface AdminOrdersTableProps {
  orders: Order[];
}

const AdminOrdersTable: FC<AdminOrdersTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="animate-fade-up-delay-2 rounded-[14px] border border-border bg-card px-6 py-12 text-center">
        <p className="text-[15px] font-medium text-foreground">
          No orders found.
        </p>
        <p className="mt-1 text-[13px] text-muted">
          Adjust your search or wait for new purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up-delay-2 overflow-x-auto rounded-[14px] border border-border bg-card">
      <table className="w-full min-w-[700px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-border text-[13px] text-muted">
            <th className="px-6 py-4 font-medium">Order ID</th>
            <th className="px-6 py-4 font-medium">Course ID</th>
            <th className="px-6 py-4 font-medium">User ID</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order, index) => (
            <tr
              key={order._id}
              className="transition-colors duration-200 hover:bg-muted/5"
              style={{ animationDelay: `${(index + 3) * 50}ms` }}
            >
              {/* Order ID */}
              <td className="px-6 py-4">
                <span className="font-mono text-[12px] text-muted">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </td>

              {/* Course ID */}
              <td className="px-6 py-4">
                <span className="font-mono text-[12px] text-muted">
                  {order.courseId.slice(-8).toUpperCase()}
                </span>
              </td>

              {/* User ID */}
              <td className="px-6 py-4">
                <span className="font-mono text-[12px] text-muted">
                  {order.userId.slice(-8).toUpperCase()}
                </span>
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-[13px] text-muted">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-[12px] font-medium text-green-600 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Paid
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
