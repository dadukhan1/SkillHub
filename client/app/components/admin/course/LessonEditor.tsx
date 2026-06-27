"use client";

import { FC } from "react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Textarea from "@/app/components/ui/Textarea";
import { VIDEO_PLAYERS, type CourseLessonFormValues } from "@/lib/course-form";
import { cn } from "@/lib/utils";

interface LessonEditorProps {
  lesson: CourseLessonFormValues;
  isCollapsed: boolean;
  onToggle: () => void;
  onUpdate: (
    key: keyof CourseLessonFormValues,
    value: string,
  ) => void;
  onRemove: () => void;
}

const LessonEditor: FC<LessonEditorProps> = ({
  lesson,
  isCollapsed,
  onToggle,
  onUpdate,
  onRemove,
}) => {
  const displayName = lesson.title.trim() || "Untitled lesson";

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-surface/40">
      <div className="flex items-center gap-2 border-b border-border bg-card/60 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? `Expand ${displayName}` : `Collapse ${displayName}`}
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
          value={lesson.title}
          onChange={(event) => onUpdate("title", event.target.value)}
          onClick={(event) => event.stopPropagation()}
          placeholder="Name this lesson"
          className="min-w-0 flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4 p-5">
          <Textarea
            label="Description"
            value={lesson.description}
            onChange={(event) => onUpdate("description", event.target.value)}
            placeholder="Brief overview of what this lesson covers."
            className="min-h-[96px]"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Video section"
              value={lesson.videoSection}
              onChange={(event) => onUpdate("videoSection", event.target.value)}
              placeholder="Module 1"
            />
            <Select
              label="Video player"
              value={lesson.videoPlayer}
              onChange={(event) => onUpdate("videoPlayer", event.target.value)}
              options={VIDEO_PLAYERS.map((player) => ({
                value: player,
                label: player.charAt(0).toUpperCase() + player.slice(1),
              }))}
            />
          </div>
          <Input
            label="Video URL"
            type="url"
            value={lesson.videoUrl}
            onChange={(event) => onUpdate("videoUrl", event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min="1"
            step="1"
            value={lesson.videoLength}
            onChange={(event) => onUpdate("videoLength", event.target.value)}
            placeholder="12"
          />
        </div>
      )}
    </div>
  );
};

export default LessonEditor;
