"use client";

import { FC, useMemo, useState } from "react";
import AdminOrdersTable from "@/app/components/admin/AdminOrdersTable";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminSearchInput from "@/app/components/admin/AdminSearchInput";
import { useGetAllOrdersQuery } from "@/redux/features/ordersApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { useAuth } from "@/redux/hooks";
import { isAdmin } from "@/lib/user";

const AdminOrdersPage: FC = () => {
  const { user } = useAuth();
  const isAdminUser = user ? isAdmin(user.role) : false;
  const { data, isLoading, isError, error } = useGetAllOrdersQuery(undefined, {
    skip: !isAdminUser,
    pollingInterval: 30000,
  });
  const [search, setSearch] = useState("");

  const orders = (data?.orders ?? []) as {
    _id: string;
    courseId: string;
    userId: string;
    createdAt: string;
    paymentInfo?: Record<string, unknown>;
  }[];

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(q) ||
        o.courseId.toLowerCase().includes(q) ||
        o.userId.toLowerCase().includes(q),
    );
  }, [orders, search]);

  if (isLoading) {
    return <AdminLoadingState label="Loading orders…" />;
  }

  if (isError) {
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">
          {getErrorMessage(error, "Failed to load orders.")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        label="Orders module"
        title={
          <>
            Manage your orders.
            <br />
            <span className="text-muted">Revenue at a glance.</span>
          </>
        }
        description="Track all purchases made on the platform. Every order here was processed and confirmed by Stripe."
      />

      <div className="animate-fade-up-delay-2 mt-8 space-y-6">
        {/* Summary stat */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-[14px] border border-border bg-card px-5 py-4">
            <p className="text-[13px] text-muted">Total orders</p>
            <p className="mt-1 text-[1.75rem] font-semibold tracking-[-0.04em]">
              {orders.length}
            </p>
          </div>
          <div className="rounded-[14px] border border-border bg-card px-5 py-4">
            <p className="text-[13px] text-muted">Showing</p>
            <p className="mt-1 text-[1.75rem] font-semibold tracking-[-0.04em]">
              {filteredOrders.length}
            </p>
          </div>
        </div>

        {/* Search + count */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by order ID, course ID, or user ID…"
            className="sm:max-w-md"
          />
          <p className="text-[13px] text-muted">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <AdminOrdersTable orders={filteredOrders} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
