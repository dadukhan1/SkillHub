"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";

interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const AdminSearchInput: FC<AdminSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search courses…",
  className,
}) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-3 transition-all duration-200 focus-within:border-foreground/20 focus-within:ring-2 focus-within:ring-ring",
      className,
    )}
  >
    <svg
      className="shrink-0 text-muted-foreground"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
    />
  </div>
);

export default AdminSearchInput;
