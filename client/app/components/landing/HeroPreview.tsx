import { FC } from "react";

const HeroPreview: FC = () => (
  <div className="relative mx-auto w-full max-w-md lg:max-w-none">
    <div className="overflow-hidden rounded-[18px] border border-border bg-card shadow-elevated">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        <div className="mx-auto text-[11px] text-muted-foreground">skillhub.com</div>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">Welcome back</p>
            <p className="mt-0.5 text-sm font-medium tracking-[-0.01em]">Continue learning</p>
          </div>
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted">
            14-day streak
          </span>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-foreground/[0.06] text-[11px] font-medium text-muted">
              RE
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">Advanced React Patterns</p>
              <p className="text-[11px] text-muted">Module 4 · Hooks & Composition</p>
            </div>
            <span className="text-[13px] font-medium tabular-nums">72%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[72%] rounded-full bg-accent" />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {[
            { title: "Custom Hooks Deep Dive", duration: "12 min", active: true },
            { title: "Compound Components", duration: "18 min", active: false },
            { title: "Performance Patterns", duration: "22 min", active: false },
          ].map((lesson) => (
            <div
              key={lesson.title}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] ${
                lesson.active ? "bg-surface" : "text-muted"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${
                  lesson.active ? "border-foreground/20 bg-foreground text-background" : "border-border"
                }`}
              >
                {lesson.active && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
              <span className={`flex-1 truncate ${lesson.active ? "font-medium text-foreground" : ""}`}>
                {lesson.title}
              </span>
              <span className="text-[11px] tabular-nums">{lesson.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="absolute -bottom-4 -left-4 rounded-[14px] border border-border bg-card px-4 py-3 shadow-soft">
      <p className="text-[10px] text-muted">This week</p>
      <p className="mt-0.5 text-base font-semibold tracking-[-0.02em] tabular-nums">8.5 hrs</p>
    </div>
  </div>
);

export default HeroPreview;
