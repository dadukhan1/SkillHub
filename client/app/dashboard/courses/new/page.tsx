"use client";

import { FC } from "react";
import Link from "next/link";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import CourseForm from "@/app/components/admin/course/CourseForm";
import Button from "@/app/components/ui/Button";
import { createEmptyCourseForm } from "@/lib/course-form";

const CreateCoursePage: FC = () => (
  <div className="mx-auto max-w-6xl">
    <AdminPageHeader
      label="Create course"
      title={
        <>
          Build with clarity.
          <br />
          <span className="text-muted">Publish with purpose.</span>
        </>
      }
      description="Define your course structure, pricing, and curriculum in one focused flow. Every field maps directly to your catalog."
      actions={
        <Link href="/dashboard/courses">
          <Button variant="secondary" size="sm">
            Back to courses
          </Button>
        </Link>
      }
    />

    <div className="animate-fade-up-delay-2 mt-8">
      <CourseForm mode="create" initialValues={createEmptyCourseForm()} />
    </div>
  </div>
);

export default CreateCoursePage;
