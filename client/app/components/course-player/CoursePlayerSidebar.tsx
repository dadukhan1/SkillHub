"use client";

import { FC } from "react";
import type { CurriculumSection } from "@/redux/types/course";
import { formatVideoDuration } from "@/lib/course-curriculum";
import { cn } from "@/lib/utils";

interface CoursePlayerSidebarProps {
  sections: CurriculumSection[];
  activeVideoId: string | null;
  collapsedSections: Record<string, boolean>;
  onToggleSection: (sectionKey: string) => void;
  onSelectVideo: (videoId: string) => void;
}

const CoursePlayerSidebar: FC<CoursePlayerSidebarProps> = ({
  sections,
  activeVideoId,
  collapsedSections,
  onToggleSection,
  onSelectVideo,
}) => (
  <aside className="flex h-full min-h-0 flex-col border-r border-border bg-card">
    <div className="shrink-0 border-b border-border px-4 py-4">
      <p className="label mb-1">Curriculum</p>
      <p className="text-[13px] text-muted">Sections and videos</p>
    </div>

    <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
      <div className="space-y-2">
        {sections.map((section) => {
          const isCollapsed = collapsedSections[section.key] ?? true;

          return (
            <div
              key={section.key}
              className="overflow-hidden rounded-[12px] border border-border bg-surface/30"
            >
              <button
                type="button"
                onClick={() => onToggleSection(section.key)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-surface/60"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "shrink-0 text-muted transition-transform duration-200",
                    isCollapsed ? "-rotate-90" : "rotate-0",
                  )}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                  {section.title}
                </span>
                <span className="shrink-0 text-[11px] text-muted">
                  {section.videos.length}
                </span>
              </button>

              {!isCollapsed && (
                <ul className="space-y-0.5 border-t border-border px-2 py-2">
                  {section.videos.map((video) => {
                    const videoId = video.key;
                    const isActive = activeVideoId === videoId;

                    return (
                      <li key={videoId}>
                        <button
                          type="button"
                          onClick={() => onSelectVideo(videoId)}
                          className={cn(
                            "flex w-full items-start gap-2.5 rounded-[10px] px-2.5 py-2 text-left transition-colors",
                            isActive
                              ? "bg-accent-muted text-foreground"
                              : "text-muted hover:bg-surface hover:text-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                              isActive
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border bg-card",
                            )}
                          >
                            ▶
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium">
                              {video.title}
                            </span>
                            <span className="mt-0.5 block text-[11px] text-muted-foreground">
                              {formatVideoDuration(video.videoLength)}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  </aside>
);

export default CoursePlayerSidebar;
