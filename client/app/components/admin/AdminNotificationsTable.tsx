import { FC } from "react";
import Button from "@/app/components/ui/Button";
import type { Notification } from "@/redux/types/notification";

interface AdminNotificationsTableProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  markingId: string | null;
}

function getNotificationType(title: string) {
  if (title.includes("Question")) return "Question";
  if (title.includes("Review")) return "Review";
  if (title.includes("Order")) return "Order";
  return "Update";
}

function getTypeStyles(type: string) {
  switch (type) {
    case "Question":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "Review":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "Order":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const AdminNotificationsTable: FC<AdminNotificationsTableProps> = ({
  notifications,
  onMarkRead,
  markingId,
}) => {
  if (notifications.length === 0) {
    return (
      <div className='animate-fade-up-delay-2 rounded-[14px] border border-border bg-card px-6 py-12 text-center'>
        <p className='text-[15px] font-medium text-foreground'>
          No notifications found.
        </p>
        <p className='mt-1 text-[13px] text-muted'>
          New questions, reviews, and orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className='animate-fade-up-delay-2 space-y-3'>
      {notifications.map((notification, index) => {
        const type = getNotificationType(notification.title);
        const isUnread = notification.status === "unread";
        const isMarking = markingId === notification._id;

        return (
          <article
            key={notification._id}
            className={`rounded-[14px] border bg-card p-5 transition-colors duration-200 ${
              isUnread
                ? "border-primary/20 bg-primary/[0.03]"
                : "border-border"
            }`}
            style={{ animationDelay: `${(index + 3) * 50}ms` }}
          >
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getTypeStyles(type)}`}
                  >
                    {type}
                  </span>
                  {isUnread && (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary'>
                      <span className='h-1.5 w-1.5 rounded-full bg-primary' />
                      Unread
                    </span>
                  )}
                </div>

                <h3 className='mt-3 text-[15px] font-medium text-foreground'>
                  {notification.title}
                </h3>
                <p className='mt-2 text-[14px] leading-relaxed text-muted'>
                  {notification.message}
                </p>
                <p className='mt-3 text-[12px] text-muted-foreground'>
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>

              {isUnread && (
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className='shrink-0'
                  disabled={isMarking}
                  onClick={() => onMarkRead(notification._id)}
                >
                  {isMarking ? "Marking..." : "Mark as read"}
                </Button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default AdminNotificationsTable;
