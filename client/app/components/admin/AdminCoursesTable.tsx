"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import {
  formatCourseDate,
  formatCoursePrice,
  getCourseLessonCount,
} from "@/lib/course-utils";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { useDeleteCourseMutation } from "@/redux/features/courseApiSlice";
import type { AdminCourse } from "@/redux/types/course";

interface AdminCoursesTableProps {
  courses: AdminCourse[];
}

const AdminCoursesTable: FC<AdminCoursesTableProps> = ({ courses }) => {
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDelete = async (course: AdminCourse) => {
    const confirmed = window.confirm(
      `Delete "${course.name}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setPendingDeleteId(course._id);

    try {
      await deleteCourse(course._id).unwrap();
      toast.success(`"${course.name}" deleted successfully.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete course."));
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-[15px] font-medium text-foreground">No courses found</p>
        <p className="mt-2 text-sm text-muted">
          Try adjusting your search or create a new course.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-[14px] border border-border bg-card lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface/50">
            <tr>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Course</th>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Level</th>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Price</th>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Enrolled</th>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Rating</th>
              <th className="px-5 py-3.5 text-[12px] font-medium text-muted">Updated</th>
              <th className="px-5 py-3.5 text-right text-[12px] font-medium text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-b border-border last:border-b-0 transition-colors hover:bg-surface/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <CourseThumbnail course={course} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{course.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted">
                        {getCourseLessonCount(course)} lessons · {course.tags}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="outline">{course.level}</Badge>
                </td>
                <td className="px-5 py-4 tabular-nums">{formatCoursePrice(course.price)}</td>
                <td className="px-5 py-4 tabular-nums">{course.purchased ?? 0}</td>
                <td className="px-5 py-4 tabular-nums">
                  {(course.ratings ?? 0).toFixed(1)}
                </td>
                <td className="px-5 py-4 text-muted">
                  {formatCourseDate(course.updatedAt ?? course.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/courses/${course._id}/edit`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                      disabled={isDeleting && pendingDeleteId === course._id}
                      onClick={() => handleDelete(course)}
                    >
                      {isDeleting && pendingDeleteId === course._id
                        ? "Deleting…"
                        : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {courses.map((course) => (
          <article
            key={course._id}
            className="rounded-[14px] border border-border bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <CourseThumbnail course={course} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{course.name}</p>
                    <p className="mt-1 text-[12px] text-muted">
                      {getCourseLessonCount(course)} lessons · {course.tags}
                    </p>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                  <div>
                    <p className="text-muted">Price</p>
                    <p className="mt-0.5 font-medium tabular-nums">
                      {formatCoursePrice(course.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Enrolled</p>
                    <p className="mt-0.5 font-medium tabular-nums">
                      {course.purchased ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Rating</p>
                    <p className="mt-0.5 font-medium tabular-nums">
                      {(course.ratings ?? 0).toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/courses/${course._id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    disabled={isDeleting && pendingDeleteId === course._id}
                    onClick={() => handleDelete(course)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const CourseThumbnail: FC<{ course: AdminCourse }> = ({ course }) => {
  const url = course.thumbnail?.url;

  if (url) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-surface">
        <Image src={url} alt="" fill className="object-cover" sizes="44px" />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-accent-muted text-[11px] font-semibold text-accent">
      {course.name.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default AdminCoursesTable;
