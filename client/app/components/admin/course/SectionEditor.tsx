"use client";

import { FC } from "react";
import VideoEditor from "@/app/components/admin/course/VideoEditor";
import Button from "@/app/components/ui/Button";
import {
  type CourseSectionFormValues,
  type CourseVideoFormValues,
} from "@/lib/course-form";
import { cn } from "@/lib/utils";

interface SectionEditorProps {
  section: CourseSectionFormValues;
  isCollapsed: boolean;
  collapsedVideos: Record<string, boolean>;
  onToggleSection: () => void;
  onToggleVideo: (videoKey: string) => void;
  onUpdateSection: (value: string) => void;
  onUpdateVideo: (
    videoIndex: number,
    key: keyof CourseVideoFormValues,
    value: string,
  ) => void;
  onAddVideo: () => void;
  onRemoveVideo: (videoIndex: number) => void;
  onRemoveSection: () => void;
}

const SectionEditor: FC<SectionEditorProps> = ({
  section,
  isCollapsed,
  collapsedVideos,
  onToggleSection,
  onToggleVideo,
  onUpdateSection,
  onUpdateVideo,
  onAddVideo,
  onRemoveVideo,
  onRemoveSection,
}) => {
  const displayName = section.title.trim() || "Untitled section";
  const videoCount = section.videos.length;

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-surface/40">
      <div className="flex items-center gap-2 border-b border-border bg-card/60 px-4 py-3">
        <button
          type="button"
          onClick={onToggleSection}
          aria-expanded={!isCollapsed}
          aria-label={
            isCollapsed ? `Expand ${displayName}` : `Collapse ${displayName}`
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <input
          type="text"
          value={section.title}
          onChange={(event) => onUpdateSection(event.target.value)}
          placeholder="Name this section"
          className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />

        <span className="hidden shrink-0 text-[12px] text-muted sm:inline">
          {videoCount} {videoCount === 1 ? "video" : "videos"}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={onRemoveSection}
        >
          Remove
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <p className="text-[13px] font-medium text-foreground">Videos</p>
            <div className="space-y-2">
              {section.videos.map((video, videoIndex) => (
                <VideoEditor
                  key={video.key}
                  video={video}
                  isCollapsed={collapsedVideos[video.key] ?? true}
                  onToggle={() => onToggleVideo(video.key)}
                  onUpdate={(key, value) => onUpdateVideo(videoIndex, key, value)}
                  onRemove={() => onRemoveVideo(videoIndex)}
                />
              ))}
            </div>
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={onAddVideo}>
            Add video
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
