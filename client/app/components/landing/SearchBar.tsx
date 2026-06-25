"use client";

import { FC, FormEvent, useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  size?: "default" | "large";
}

const SearchBar: FC<SearchBarProps> = ({ className, size = "default" }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-[14px] border border-border bg-card transition-all duration-200 focus-within:border-foreground/20 focus-within:ring-2 focus-within:ring-ring",
          size === "large" ? "px-4 py-3.5" : "px-3.5 py-2.5"
        )}
      >
        <svg
          className="shrink-0 text-muted-foreground"
          width={size === "large" ? 18 : 16}
          height={size === "large" ? 18 : 16}
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, topics, or instructors..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none",
            size === "large" ? "text-[15px]" : "text-sm"
          )}
        />
        <kbd className="hidden rounded-[6px] border border-border bg-surface px-1.5 py-0.5 text-[11px] text-muted-foreground sm:inline-block">
          ⌘K
        </kbd>
      </div>
    </form>
  );
};

export default SearchBar;
