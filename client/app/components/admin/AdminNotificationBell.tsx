"use client";

import Link from "next/link";
import { FC } from "react";
import { useGetAllNotificationsQuery } from "@/redux/features/notificationApiSlice";
import { isAdmin } from "@/lib/user";
import { useAuth } from "@/redux/hooks";

interface AdminNotificationBellProps {
  compact?: boolean;
}

const AdminNotificationBell: FC<AdminNotificationBellProps> = ({
  compact = false,
}) => {
  const { user } = useAuth();
  const isAdminUser = user ? isAdmin(user.role) : false;

  const { data } = useGetAllNotificationsQuery(undefined, {
    skip: !isAdminUser,
    pollingInterval: 30000,
  });

  if (!isAdminUser) return null;

  const unreadCount =
    data?.notifications.filter((item) => item.status === "unread").length ?? 0;

  return (
    <Link
      href='/dashboard/notifications'
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      className={`relative inline-flex items-center justify-center rounded-[10px] border border-border bg-card text-muted transition-colors hover:bg-surface hover:text-foreground ${
        compact ? "h-9 w-9" : "h-10 w-10"
      }`}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
        <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
      </svg>
      {unreadCount > 0 && (
        <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground'>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default AdminNotificationBell;
