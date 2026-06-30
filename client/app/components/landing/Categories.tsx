"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetLayoutByTypeQuery } from "@/redux/features/layoutApiSlice";
import SectionHeader from "../ui/SectionHeader";

// A small set of SVG icons to cycle through
const ICON_POOL = [
  // tag
  <svg key="tag" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>,
  // code
  <svg key="code" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  // layers
  <svg key="layers" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>,
  // briefcase
  <svg key="briefcase" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>,
  // sparkles
  <svg key="sparkles" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8H4.3l4.9 3.5-1.9 5.8L12 14.6l4.7 3.5-1.9-5.8 4.9-3.5h-5.8L12 3z" />
  </svg>,
  // chart
  <svg key="chart" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>,
  // megaphone
  <svg key="megaphone" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 13v-2z" />
    <path d="M11 13v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-8" />
  </svg>,
  // book
  <svg key="book" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>,
];

const Categories: FC = () => {
  const { data, isLoading } = useGetLayoutByTypeQuery("Categories");
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get("category") ?? "";

  const apiCategories = data?.layout?.categories ?? [];

  // While loading, show skeleton placeholders to prevent layout shift
  if (isLoading) {
    return (
      <section className="border-y border-border bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-14 h-24 animate-pulse rounded-[14px] bg-border/40" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-[14px] bg-border/40" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (apiCategories.length === 0) return null;

  const handleSelect = (title: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (!params) return;
    if (params?.get("category") === title) {
      params.delete("category");
    } else {
      params.set("category", title);
    }
    // Navigate to courses section on homepage
    router.push(`/#courses?${params?.toString() ?? ""}`, { scroll: false });
    setTimeout(() => {
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <section className="border-y border-border bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          label="Explore"
          title="Find your path"
          description="Browse by discipline. Each category is curated with learning paths designed for progressive mastery."
          className="mb-14"
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {apiCategories.map((category, i) => {
            const icon = ICON_POOL[i % ICON_POOL.length];
            const isActive = activeCategory === category.title;
            return (
              <button
                key={category.title}
                onClick={() => handleSelect(category.title)}
                className={`group flex items-center gap-4 rounded-[14px] border p-5 text-left transition-all duration-200 hover:shadow-soft ${
                  isActive
                    ? "border-foreground/20 bg-card shadow-soft"
                    : "border-border bg-card hover:border-foreground/10"
                }`}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] border transition-colors duration-200 ${
                    isActive
                      ? "border-foreground/20 text-foreground"
                      : "border-border text-muted group-hover:text-foreground"
                  }`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[15px] font-medium tracking-[-0.01em]">
                    {category.title}
                  </p>
                  {isActive && (
                    <p className="mt-0.5 text-[12px] text-muted">Selected</p>
                  )}
                </div>
                <svg
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isActive
                      ? "translate-x-0.5 text-foreground"
                      : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-muted"
                  }`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
