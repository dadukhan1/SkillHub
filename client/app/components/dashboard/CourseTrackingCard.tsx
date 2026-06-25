import { FC } from "react";
import Link from "next/link";
import ProgressRing from "./ProgressRing";

interface CourseTrackingCardProps {
  course: {
    id: string;
    title: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    lastAccessed: string;
    thumbnail: { tone: string };
  };
}

const CourseTrackingCard: FC<CourseTrackingCardProps> = ({ course }) => (
  <Link
    href={`/courses/${course.id}`}
    className="group flex items-center gap-4 rounded-[14px] border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/10 hover:shadow-soft"
  >
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-border text-[11px] font-medium text-muted"
      style={{ backgroundColor: course.thumbnail.tone }}
    >
      {course.title.slice(0, 2).toUpperCase()}
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="truncate text-[13px] font-medium tracking-[-0.01em]">
        {course.title}
      </h3>
      <p className="mt-0.5 text-[11px] text-muted">
        {course.lessonsCompleted}/{course.totalLessons} lessons · {course.lastAccessed}
      </p>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${course.progress}%` }}
        />
      </div>
    </div>

    <ProgressRing progress={course.progress} size={44} strokeWidth={2.5} />
  </Link>
);

export default CourseTrackingCard;
