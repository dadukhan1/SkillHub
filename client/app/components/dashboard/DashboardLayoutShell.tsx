"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import ThemeToggle from "@/app/components/ThemeToggle";
import UserProfileMenu from "@/app/components/layout/UserProfileMenu";
import Link from "next/link";

interface DashboardLayoutShellProps {
  children: ReactNode;
}

const DashboardLayoutShell: FC<DashboardLayoutShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-background">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        mobileOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6 lg:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border bg-card text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <Link
              href="/"
              className="truncate text-[15px] font-semibold tracking-[-0.02em]"
            >
              SkillHub
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <UserProfileMenu variant="header" compact />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutShell;
