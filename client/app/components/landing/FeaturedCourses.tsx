"use client";

import { FC, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SectionHeader from "../ui/SectionHeader";
import { useGetLayoutByTypeQuery } from "@/redux/features/layoutApiSlice";
import { useGetPublicCoursesQuery } from "@/redux/features/courseApiSlice";

// ── Fallback card when no thumbnail image ─────────────────────────────────────
const TONE_PALETTE = [
  "#5e6ad2",
  "#8b5cf6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

function levelColor(level: string) {
  const l = level.toLowerCase();
  if (l.includes("beginner")) return "bg-emerald-500/10 text-emerald-400";
  if (l.includes("advanced")) return "bg-red-500/10 text-red-400";
  return "bg-blue-500/10 text-blue-400";
}

const FeaturedCourses: FC = () => {
  const { data: categoriesData } = useGetLayoutByTypeQuery("Categories");
  const { data: coursesData, isLoading } = useGetPublicCoursesQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get("category") ?? "";

  const apiCategories = categoriesData?.layout?.categories ?? [];
  const allCourses = coursesData?.courses ?? [];

  // Filter: match course.tags against selected category (case-insensitive)
  const filtered = useMemo(() => {
    if (!activeCategory) return allCourses;
    return allCourses.filter((c) => {
      const tags = (c.tags ?? "").toLowerCase();
      return tags
        .split(/[,\s]+/)
        .some((tag) => tag.trim() === activeCategory.toLowerCase());
    });
  }, [allCourses, activeCategory]);

  const setCategory = (title: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (!params) return;
    if (params?.get("category") === title) {
      params.delete("category");
    } else {
      params.set("category", title);
    }
    const qs = params?.toString() ?? "";
    router.push(qs ? `/?${qs}` : `/`, { scroll: false });
  };

  return (
    <section id="courses" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Header row */}
        <div className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            label="Featured"
            title="Courses crafted for excellence"
            description="Hand-picked by our team. Every course meets our standard for depth, clarity, and real-world relevance."
          />
          {allCourses.length > 0 && (
            <span className="shrink-0 text-[13px] text-muted">
              {allCourses.length} course{allCourses.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Category filter pills */}
        {apiCategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                !activeCategory
                  ? "border-foreground/20 bg-foreground text-background"
                  : "border-border bg-card text-muted hover:border-foreground/15 hover:text-foreground"
              }`}
            >
              All
            </button>
            {apiCategories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => setCategory(cat.title)}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                  activeCategory === cat.title
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-border bg-card text-muted hover:border-foreground/15 hover:text-foreground"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-[16px] border border-border bg-card"
              >
                <div className="aspect-[16/10] bg-border/40" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-border/40" />
                  <div className="h-3 w-1/2 rounded bg-border/40" />
                  <div className="h-3 w-1/3 rounded bg-border/40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((course, idx) => {
              const tone = TONE_PALETTE[idx % TONE_PALETTE.length];
              const hasThumb = !!course.thumbnail?.url;
              return (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="group flex flex-col overflow-hidden rounded-[16px] border border-border bg-card transition-all duration-200 hover:border-foreground/10 hover:shadow-elevated"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    {hasThumb ? (
                      <Image
                        src={course.thumbnail!.url!}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
                          style={{ backgroundColor: tone }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                            opacity: 0.5,
                          }}
                        />
                      </>
                    )}
                    {/* Level badge */}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {course.level && (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${levelColor(course.level)}`}
                        >
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-3 line-clamp-2 text-[15px] font-medium leading-snug tracking-[-0.01em] text-foreground transition-colors group-hover:text-foreground/80">
                      {course.name}
                    </h3>

                    {/* Tags */}
                    {course.tags && (
                      <p className="mb-4 truncate text-[12px] text-muted">
                        {course.tags}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-1.5 text-[13px] text-muted">
                        {course.ratings != null && course.ratings > 0 && (
                          <>
                            <span className="font-medium text-foreground">
                              {course.ratings.toFixed(1)}
                            </span>
                            <span className="text-yellow-400">★</span>
                          </>
                        )}
                        {course.purchased != null && course.purchased > 0 && (
                          <span className="text-[12px]">
                            {course.ratings != null && course.ratings > 0 && "· "}
                            {course.purchased.toLocaleString()} enrolled
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        {course.estimatedPrice != null &&
                          course.estimatedPrice > course.price && (
                            <span className="text-[12px] text-muted line-through">
                              ${course.estimatedPrice}
                            </span>
                          )}
                        <span className="text-[15px] font-semibold tracking-[-0.01em]">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-border bg-card py-20 text-center">
            {activeCategory ? (
              <>
                <p className="text-[15px] font-medium text-foreground">
                  No courses tagged &quot;{activeCategory}&quot;
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  Make sure courses have &quot;{activeCategory}&quot; in their tags field.
                </p>
                <button
                  onClick={() => setCategory("")}
                  className="mt-5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                >
                  Clear filter
                </button>
              </>
            ) : (
              <>
                <p className="text-[15px] font-medium text-foreground">
                  No courses yet
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  Check back soon — courses are being added.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
