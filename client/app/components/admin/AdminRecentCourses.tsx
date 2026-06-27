"use client";

import { FC } from "react";
import Link from "next/link";
import Badge from "@/app/components/ui/Badge";
import {
  formatCourseDate,
  formatCoursePrice,
  getCourseLessonCount,
  getCourseSectionCount,
} from "@/lib/course-utils";
import type { AdminCourse } from "@/redux/types/course";

interface AdminRecentCoursesProps {
  courses: AdminCourse[];
}

const AdminRecentCourses: FC<AdminRecentCoursesProps> = ({ courses }) => {
  const recent = courses.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-border bg-card px-6 py-10 text-center">
        <p className="text-sm text-muted">No courses yet. Create your first course to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.02em]">Recent courses</h2>
          <p className="mt-0.5 text-[13px] text-muted">Latest updates across your catalog</p>
        </div>
        <Link
          href="/dashboard/courses"
          className="text-[13px] text-muted transition-colors hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {recent.map((course) => (
          <li
            key={course._id}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface/40"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{course.name}</p>
              <p className="mt-0.5 text-[12px] text-muted">
                {getCourseSectionCount(course)} sections · {getCourseLessonCount(course)} videos · Updated{" "}
                {formatCourseDate(course.updatedAt ?? course.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge variant="outline">{course.level}</Badge>
              <span className="text-sm font-medium tabular-nums">
                {formatCoursePrice(course.price)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRecentCourses;
