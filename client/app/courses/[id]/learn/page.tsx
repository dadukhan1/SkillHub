"use client";

import { FC, Suspense } from "react";
import { useParams } from "next/navigation";
import CoursePlayer from "@/app/components/course-player/CoursePlayer";

const CourseLearnPage: FC = () => {
  const params = useParams<{ id: string }>();
  const courseId = params?.id ?? "";

  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      }
    >
      <CoursePlayer courseId={courseId} />
    </Suspense>
  );
};

export default CourseLearnPage;
