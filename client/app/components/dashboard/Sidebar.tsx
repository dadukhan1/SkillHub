"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/redux/hooks";
import ThemeToggle from "../ThemeToggle";
import UserProfileMenu from "../layout/UserProfileMenu";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "My Courses",
    href: "/dashboard/courses",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
  },
  {
    label: "Paths",
    href: "/dashboard/paths",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m7 16 4-8 4 4 6-8" />
      </svg>
    ),
  },
  {
    label: "Certificates",
    href: "/dashboard/certificates",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

const Sidebar: FC<SidebarProps> = ({ mobileOpen = false, onNavigate }) => {
  const pathname = usePathname();
  const { user } = useAuth();

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

      <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] transition-colors duration-200",
                isActive
                  ? "bg-surface font-medium text-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {item.icon}
              {item.label}
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
