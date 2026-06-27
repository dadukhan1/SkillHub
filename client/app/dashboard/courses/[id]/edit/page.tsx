"use client";

import { FC } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import CourseForm from "@/app/components/admin/course/CourseForm";
import Button from "@/app/components/ui/Button";
import { courseToFormValues } from "@/lib/course-form";
import { useGetAdminCourseQuery } from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

const EditCoursePage: FC = () => {
  const params = useParams<{ id: string }>();
  const courseId = params?.id ?? "";

  const { data, isLoading, isError, error } = useGetAdminCourseQuery(courseId, {
    skip: !courseId,
  });

  if (isLoading) {
    return <AdminLoadingState label="Loading course…" />;
  }

  if (isError || !data?.course) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
          <p className="text-sm text-red-500">
            {getErrorMessage(error, "Course not found or could not be loaded.")}
          </p>
          <Link href="/dashboard/courses" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              Back to courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        label="Edit course"
        title={
          <>
            Refine with clarity.
            <br />
            <span className="text-muted">{data.course.name}</span>
          </>
        }
        description="Update course details, pricing, and curriculum. Changes apply immediately across the platform."
        actions={
          <Link href="/dashboard/courses">
            <Button variant="secondary" size="sm">
              Back to courses
            </Button>
          </Link>
        }
      />

      <div className="animate-fade-up-delay-2 mt-8">
        <CourseForm
          mode="edit"
          courseId={courseId}
          initialValues={courseToFormValues(data.course)}
        />
      </div>
    </div>
  );
};

export default EditCoursePage;
