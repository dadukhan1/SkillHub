"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavItems, isAdminNavActive } from "@/lib/admin-nav";
import { isAdmin } from "@/lib/user";
import { useAuth } from "@/redux/hooks";
import { useGetAllNotificationsQuery } from "@/redux/features/notificationApiSlice";
import ThemeToggle from "../ThemeToggle";
import UserProfileMenu from "../layout/UserProfileMenu";

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ mobileOpen = false, onNavigate }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdminUser = user ? isAdmin(user.role) : false;

  const { data: notificationsData } = useGetAllNotificationsQuery(undefined, {
    skip: !isAdminUser,
    pollingInterval: 30000,
  });

  const unreadCount =
    notificationsData?.notifications.filter((item) => item.status === "unread")
      .length ?? 0;

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-border bg-card lg:static lg:w-56 lg:translate-x-0",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:relative",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-5 lg:h-[60px]">
        <Link
          href="/"
          onClick={onNavigate}
          className="text-[15px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70"
        >
          SkillHub
        </Link>

        <button
          type="button"
          onClick={onNavigate}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-surface hover:text-foreground lg:hidden"
          aria-label="Close navigation menu"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="border-b border-border px-5 py-3">
        <p className="label">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {adminNavItems.map((item) => {
          const isActive = isAdminNavActive(pathname ?? "", item.href);

          if (!item.enabled) {
            return (
              <div
                key={item.href}
                className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-[13px] text-muted-foreground"
                aria-disabled="true"
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-200",
                isActive
                  ? "bg-surface font-medium text-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              <span className='flex items-center gap-2.5'>
                {item.icon}
                {item.label}
              </span>
              {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                <span className='rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground'>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            {user && <UserProfileMenu variant="sidebar" />}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
