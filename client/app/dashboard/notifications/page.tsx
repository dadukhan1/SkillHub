"use client";

import { FC, useMemo, useState } from "react";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminNotificationsTable from "@/app/components/admin/AdminNotificationsTable";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminSearchInput from "@/app/components/admin/AdminSearchInput";
import Button from "@/app/components/ui/Button";
import {
  useGetAllNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useUpdateNotificationMutation,
} from "@/redux/features/notificationApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

type FilterStatus = "all" | "unread" | "read";

const AdminNotificationsPage: FC = () => {
  const { data, isLoading, isError, error } = useGetAllNotificationsQuery(
    undefined,
    { pollingInterval: 30000 },
  );
  const [updateNotification] = useUpdateNotificationMutation();
  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [markingId, setMarkingId] = useState<string | null>(null);

  const notifications = data?.notifications ?? [];

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.status === "unread").length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    const q = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && item.status === "unread") ||
        (filter === "read" && item.status === "read");

      if (!matchesFilter) return false;
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    });
  }, [notifications, search, filter]);

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await updateNotification(id).unwrap();
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    await markAllRead().unwrap();
  };

  if (isLoading) {
    return <AdminLoadingState label='Loading notifications…' />;
  }

  if (isError) {
    return (
      <div className='rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center'>
        <p className='text-sm text-red-500'>
          {getErrorMessage(error, "Failed to load notifications.")}
        </p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <AdminPageHeader
        label='Notifications module'
        title={
          <>
            Stay on top of activity.
            <br />
            <span className='text-muted'>Questions, reviews, and orders.</span>
          </>
        }
        description='See platform events as they happen. Mark items as read to keep your inbox clear.'
        actions={
          unreadCount > 0 ? (
            <Button
              size='sm'
              variant='secondary'
              disabled={isMarkingAll}
              onClick={() => void handleMarkAllRead()}
            >
              {isMarkingAll ? "Updating..." : "Mark all as read"}
            </Button>
          ) : undefined
        }
      />

      <div className='animate-fade-up-delay-2 mt-8 space-y-6'>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
          <div className='rounded-[14px] border border-border bg-card px-5 py-4'>
            <p className='text-[13px] text-muted'>Total</p>
            <p className='mt-1 text-[1.75rem] font-semibold tracking-[-0.04em]'>
              {notifications.length}
            </p>
          </div>
          <div className='rounded-[14px] border border-border bg-card px-5 py-4'>
            <p className='text-[13px] text-muted'>Unread</p>
            <p className='mt-1 text-[1.75rem] font-semibold tracking-[-0.04em]'>
              {unreadCount}
            </p>
          </div>
          <div className='rounded-[14px] border border-border bg-card px-5 py-4'>
            <p className='text-[13px] text-muted'>Showing</p>
            <p className='mt-1 text-[1.75rem] font-semibold tracking-[-0.04em]'>
              {filteredNotifications.length}
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder='Search notifications…'
            className='lg:max-w-md'
          />

          <div className='flex flex-wrap gap-2'>
            {(["all", "unread", "read"] as const).map((value) => (
              <button
                key={value}
                type='button'
                onClick={() => setFilter(value)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                  filter === value
                    ? "bg-foreground text-background"
                    : "border border-border bg-card text-muted hover:text-foreground"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <AdminNotificationsTable
          notifications={filteredNotifications}
          onMarkRead={(id) => void handleMarkRead(id)}
          markingId={markingId}
        />
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
