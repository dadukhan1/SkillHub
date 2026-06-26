"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/redux/hooks";
import { formatRole } from "@/lib/user";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";
import UserProfileMenu from "./layout/UserProfileMenu";
import UserAvatar from "./ui/UserAvatar";

const navLinks = [
  { label: "Courses", href: "#courses" },
  { label: "Paths", href: "#paths" },
  { label: "Instructors", href: "#instructors" },
  { label: "Pricing", href: "#pricing" },
];

const actionClusterClass =
  "flex items-center gap-0.5 rounded-[12px] border border-border bg-card p-0.5 shadow-soft";

const clusterDivider = <div className="mx-0.5 h-5 w-px shrink-0 bg-border" aria-hidden />;

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isChecking } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[60px] sm:gap-4 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
        >
          SkillHub
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[10px] px-3.5 py-2 text-[13px] text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isChecking ? (
            <div className={cn(actionClusterClass, "px-2 py-1")}>
              <div className="h-8 w-16 animate-pulse rounded-[10px] bg-surface" />
              <div className="h-8 w-8 animate-pulse rounded-[10px] bg-surface" />
            </div>
          ) : isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="hidden lg:block">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>

              <div className={cn(actionClusterClass, "hidden sm:flex")}>
                <ThemeToggle variant="inline" />
                {clusterDivider}
                <UserProfileMenu variant="header" compact />
              </div>
            </>
          ) : (
            <>
              <Link href="/signin" className="hidden lg:block">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>

              <div className={cn(actionClusterClass, "hidden sm:flex")}>
                <ThemeToggle variant="inline" />
                {clusterDivider}
                <Link href="/signup">
                  <Button size="sm" className="rounded-[10px] px-4">
                    Get started
                  </Button>
                </Link>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-card text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
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
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out md:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-t border-border px-4 py-4 sm:max-h-[calc(100dvh-3.75rem)] sm:px-8">
            <p className="label mb-3">Explore</p>
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-[10px] px-3 py-2.5 text-[13px] text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <p className="label mb-3">Account</p>

              {isChecking ? (
                <div className="space-y-2">
                  <div className="h-10 animate-pulse rounded-[12px] bg-surface" />
                  <div className="h-10 animate-pulse rounded-[12px] bg-surface" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-3 py-3 shadow-soft">
                    <UserAvatar
                      name={user.name}
                      src={user.avatar?.url}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{user.name}</p>
                      <p className="truncate text-[12px] text-muted">{user.email}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatRole(user.role)}
                      </p>
                    </div>
                  </div>

                  <Link href="/dashboard" onClick={closeMenu}>
                    <Button className="w-full" size="md">
                      Go to dashboard
                    </Button>
                  </Link>

                  <Link href="/dashboard/settings" onClick={closeMenu}>
                    <Button variant="secondary" className="w-full" size="md">
                      Settings
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link href="/signup" onClick={closeMenu}>
                    <Button className="w-full" size="md">
                      Start learning free
                    </Button>
                  </Link>
                  <Link href="/signin" onClick={closeMenu}>
                    <Button variant="secondary" className="w-full" size="md">
                      Sign in
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-[12px] border border-border bg-surface px-3 py-2.5">
              <div>
                <p className="text-[13px] font-medium">Appearance</p>
                <p className="text-[11px] text-muted">Light or dark mode</p>
              </div>
              <ThemeToggle variant="default" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
