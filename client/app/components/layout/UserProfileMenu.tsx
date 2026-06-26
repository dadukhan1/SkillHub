"use client";

import {
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLogoutMutation } from "@/redux/features/apiSlice";
import { useAuth } from "@/redux/hooks";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { formatRole } from "@/lib/user";
import { cn } from "@/lib/utils";
import UserAvatar from "../ui/UserAvatar";

interface UserProfileMenuProps {
  variant?: "header" | "sidebar";
  compact?: boolean;
  className?: string;
}

const UserProfileMenu: FC<UserProfileMenuProps> = ({
  variant = "header",
  compact = false,
  className,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setOpen(false);
      toast.success("Signed out successfully.");
      router.push("/signin");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign out."));
    }
  };

  if (variant === "sidebar") {
    return (
      <div className={cn("relative", className)} ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-2.5 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-surface"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <UserAvatar
            name={user.name}
            src={user.avatar?.url}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            <p className="truncate text-[11px] text-muted">
              {formatRole(user.role)}
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(
              "shrink-0 text-muted transition-transform",
              open && "rotate-180",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-soft"
          >
            <MenuItems
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
              onNavigate={() => setOpen(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center gap-2 rounded-[10px] transition-colors duration-200 hover:bg-foreground/5",
          compact
            ? "h-8 px-1.5"
            : "border border-border bg-card px-2 py-1.5 hover:bg-surface",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
      >
        <UserAvatar
          name={user.name}
          src={user.avatar?.url}
          size="sm"
        />
        {!compact && (
          <>
            <span className="hidden max-w-[120px] truncate text-[13px] font-medium sm:block">
              {user.name}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={cn(
                "hidden text-muted transition-transform sm:block",
                open && "rotate-180",
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-soft"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            <p className="truncate text-[11px] text-muted">{user.email}</p>
          </div>
          <MenuItems
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            onNavigate={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

interface MenuItemsProps {
  onLogout: () => void;
  isLoggingOut: boolean;
  onNavigate: () => void;
}

const MenuItems: FC<MenuItemsProps> = ({
  onLogout,
  isLoggingOut,
  onNavigate,
}) => (
  <>
    <Link
      href="/dashboard"
      role="menuitem"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-surface"
    >
      Dashboard
    </Link>
    <Link
      href="/dashboard/settings"
      role="menuitem"
      onClick={onNavigate}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-surface"
    >
      Settings
    </Link>
    <div className="my-1 border-t border-border" />
    <button
      type="button"
      role="menuitem"
      onClick={onLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  </>
);

export default UserProfileMenu;
