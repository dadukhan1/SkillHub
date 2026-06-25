import { FC } from "react";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";

const categories = [
  "All",
  "Development",
  "Design",
  "Business",
  "Data Science",
  "Marketing",
] as const;

const previewCourses = [
  {
    title: "Product Design Systems Masterclass",
    category: "Design",
    rating: 4.8,
    students: "8.7k",
    instructor: { name: "Marcus Webb", initials: "MW" },
    tone: "#e4e4e8",
    level: "Intermediate",
  },
  {
    title: "Machine Learning Fundamentals",
    category: "Data Science",
    rating: 4.9,
    students: "15.2k",
    instructor: { name: "Dr. Aisha Patel", initials: "AP" },
    tone: "#e0e0e6",
    level: "Beginner",
  },
  {
    title: "Growth Marketing for Startups",
    category: "Marketing",
    rating: 4.7,
    students: "6.3k",
    instructor: { name: "James Okonkwo", initials: "JO" },
    tone: "#dcdce2",
    level: "Intermediate",
  },
] as const;

const HeroPreview: FC = () => (
  <div
    className="pointer-events-none relative mx-auto w-full max-w-md select-none lg:max-w-none [&_*]:select-none"
    aria-hidden
    inert
  >
    <div
      className="pointer-events-none absolute -inset-6 rounded-[28px] bg-accent/[0.06] blur-2xl"
      aria-hidden
    />

    <div className="relative overflow-hidden rounded-[18px] border border-border bg-card shadow-elevated">
      <div className="flex items-center gap-2 border-b border-border bg-surface/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
          <span className="h-2 w-2 rounded-full bg-foreground/10" />
        </div>
        <div className="mx-auto rounded-md border border-border bg-card px-3 py-0.5 text-[11px] text-muted">
          skillhub.com/courses
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
            Browse catalog
          </p>
          <p className="mt-1 text-[15px] font-medium tracking-[-0.02em]">
            Find courses across every discipline
          </p>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded-[12px] border border-border bg-surface px-3 py-2.5">
          <svg
            className="shrink-0 text-muted"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-[13px] text-muted">
            Search design, business, AI…
          </span>
        </div>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <span
              key={category}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                category === "All"
                  ? "bg-foreground text-background"
                  : "border border-border text-muted"
              }`}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="space-y-2.5">
          {previewCourses.map((course, index) => (
            <div
              key={course.title}
              className={`flex items-center gap-3 rounded-[12px] border p-3 transition-colors ${
                index === 0
                  ? "border-accent/25 bg-accent-muted/40"
                  : "border-border bg-surface/50"
              }`}
            >
              <div
                className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] border border-border"
                style={{ backgroundColor: course.tone }}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: "8px 8px",
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                    {course.category}
                  </Badge>
                  <span className="text-[10px] text-muted">{course.level}</span>
                </div>
                <p className="truncate text-[13px] font-medium leading-snug tracking-[-0.01em]">
                  {course.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                  <span className="font-medium text-foreground">
                    {course.rating}
                  </span>
                  <span>·</span>
                  <span>{course.students} learners</span>
                </div>
              </div>

              <Avatar initials={course.instructor.initials} size="sm" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <p className="text-[11px] text-muted">Showing 3 of 200+ courses</p>
          <span className="text-[12px] font-medium text-accent">
            View all →
          </span>
        </div>
      </div>
    </div>

    <div className="absolute -bottom-4 -left-4 rounded-[14px] border border-border bg-card px-4 py-3 shadow-soft">
      <p className="text-[10px] text-muted">Across 6 disciplines</p>
      <p className="mt-0.5 text-base font-semibold tracking-[-0.02em] tabular-nums">
        200+ courses
      </p>
    </div>

    <div className="absolute -top-3 -right-3 rounded-[14px] border border-border bg-card px-4 py-3 shadow-soft sm:-right-4">
      <p className="text-[10px] text-muted">Trusted by learners</p>
      <p className="mt-0.5 flex items-center gap-1 text-base font-semibold tracking-[-0.02em]">
        <span className="text-accent">★</span> 4.9 avg rating
      </p>
    </div>

    <div className="absolute -bottom-2 -right-2 hidden rounded-[12px] border border-border bg-card px-3 py-2 shadow-soft sm:block">
      <p className="text-[11px] font-medium">Start free today</p>
    </div>
  </div>
);

export default HeroPreview;
