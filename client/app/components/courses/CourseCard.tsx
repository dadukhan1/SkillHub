import { FC } from "react";
import Link from "next/link";
import { Course } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard: FC<CourseCardProps> = ({ course, className }) => (
  <Link
    href={`/courses/${course.id}`}
    className={cn(
      "group flex flex-col overflow-hidden rounded-[16px] border border-border bg-card transition-all duration-200 hover:border-foreground/10 hover:shadow-elevated",
      className
    )}
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-surface">
      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.25]"
        style={{ backgroundColor: course.thumbnail.tone }}
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
      <div className="absolute inset-0 flex items-end p-5">
        <div>
          <Badge variant="outline" className="mb-2 bg-card/80 backdrop-blur-sm">
            {course.category}
          </Badge>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            {course.level}
          </p>
        </div>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="mb-4 line-clamp-2 text-[15px] font-medium leading-snug tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-foreground/80">
        {course.title}
      </h3>

      <div className="mb-5 flex items-center gap-2.5">
        <Avatar initials={course.instructor.avatar} size="sm" />
        <span className="text-[13px] text-muted">{course.instructor.name}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <span className="font-medium text-foreground">{course.rating}</span>
          <span>·</span>
          <span>{formatNumber(course.students)} enrolled</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          {course.originalPrice && (
            <span className="text-[13px] text-muted line-through">
              ${course.originalPrice}
            </span>
          )}
          <span className="text-[15px] font-medium tracking-[-0.01em]">
            ${course.price}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

export default CourseCard;
