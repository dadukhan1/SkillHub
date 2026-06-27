"use client";

import { FC } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { VIDEO_PLAYERS, type CourseVideoFormValues } from "@/lib/course-form";
import { cn } from "@/lib/utils";

interface VideoEditorProps {
  video: CourseVideoFormValues;
  isCollapsed: boolean;
  onToggle: () => void;
  onUpdate: (key: keyof CourseVideoFormValues, value: string) => void;
  onRemove: () => void;
}

const VideoEditor: FC<VideoEditorProps> = ({
  video,
  isCollapsed,
  onToggle,
  onUpdate,
  onRemove,
}) => {
  const displayName = video.title.trim() || "Untitled video";

  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-card/80">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? `Expand ${displayName}` : `Collapse ${displayName}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-muted transition-colors hover:bg-surface hover:text-foreground"
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
              "transition-transform duration-200",
              isCollapsed ? "-rotate-90" : "rotate-0",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <input
          type="text"
          value={video.title}
          onChange={(event) => onUpdate("title", event.target.value)}
          placeholder="Name this video"
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 px-2 text-[12px] text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <Select
            label="Video player"
            value={video.videoPlayer}
            onChange={(event) => onUpdate("videoPlayer", event.target.value)}
            options={VIDEO_PLAYERS.map((player) => ({
              value: player,
              label: player.charAt(0).toUpperCase() + player.slice(1),
            }))}
          />
          <Input
            label="Video URL"
            type="url"
            value={video.videoUrl}
            onChange={(event) => onUpdate("videoUrl", event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            step="1"
            value={video.videoLength}
            onChange={(event) => onUpdate("videoLength", event.target.value)}
            placeholder="12"
          />
        </div>
      )}
    </div>
  );
};

export default VideoEditor;
