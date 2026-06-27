"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/ThemeToggle";
import UserProfileMenu from "@/app/components/layout/UserProfileMenu";
import CourseVideoPlayer from "@/app/components/course-player/CourseVideoPlayer";
import { userHasCourseAccess } from "@/lib/course-access";
import {
  formatVideoDuration,
  groupContentBySection,
} from "@/lib/course-curriculum";
import { formatCoursePrice } from "@/lib/course-utils";
import { useAuth } from "@/redux/hooks";
import { useGetCourseQuery } from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

const CourseDetailPage: FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params?.id ?? "";
  const { user } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  const { data, isLoading, isError, error } = useGetCourseQuery(courseId, {
    skip: !courseId,
  });

  const course = data?.course;
  const hasAccess = userHasCourseAccess(user, courseId);
  const sections = course?.courseData?.length
    ? groupContentBySection(
        course.courseData.map((item, index) => ({
          _id: String(index),
          title: item.title,
          description: "",
          videoUrl: "",
          videoSection: item.videoSection ?? "General",
          videoLength: item.videoLength ?? 0,
          videoPlayer: "youtube",
        })),
      )
    : [];

  const totalVideos = course?.courseData?.length ?? 0;

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background px-6">
        <p className="text-sm text-red-500">
          {getErrorMessage(error, "Course not found.")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70"
        >
          SkillHub
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserProfileMenu variant="header" compact />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="animate-fade-up">
              <p className="label mb-4">{course.level}</p>
              <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[2.5rem]">
                {course.name}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.65] text-muted">
                {course.description}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8 sm:max-w-md">
                <div>
                  <p className="text-xl font-semibold tracking-[-0.02em]">
                    {sections.length}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">Sections</p>
                </div>
                <div>
                  <p className="text-xl font-semibold tracking-[-0.02em]">
                    {totalVideos}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">Videos</p>
                </div>
                <div>
                  <p className="text-xl font-semibold tracking-[-0.02em]">
                    {(course.ratings ?? 0).toFixed(1)}
                  </p>
                  <p className="mt-1 text-[13px] text-muted">Rating</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {hasAccess ? (
                  <Link href={`/courses/${courseId}/learn`}>
                    <Button size="lg">Start learning</Button>
                  </Link>
                ) : user ? (
                  <Button size="lg" onClick={() => router.push("/#courses")}>
                    Enroll to start
                  </Button>
                ) : (
                  <Link href={`/signin?redirect=/courses/${courseId}`}>
                    <Button size="lg">Sign in to enroll</Button>
                  </Link>
                )}
                {course.demoUrl && (
                  <Button variant="secondary" size="lg" onClick={() => setShowVideo(true)}>
                    Watch demo
                  </Button>
                )}
              </div>
            </div>

            <div className="animate-fade-up-delay-1">
              <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-soft">
                <div className="relative bg-surface">
                  {showVideo ? (
                    <CourseVideoPlayer videoId={course.demoUrl} title={course.name} />
                  ) : (
                    <div className="relative aspect-[16/10]">
                      {course.thumbnail?.url ? (
                        <Image
                          src={course.thumbnail.url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 480px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[13px] text-muted">
                          No thumbnail
                        </div>
                      )}
                      {course.demoUrl && (
                        <div 
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 transition-colors hover:bg-black/50"
                          onClick={() => setShowVideo(true)}
                        >
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-t border-border p-5">
                  <p className="text-[13px] text-muted">Price</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    {course.estimatedPrice && course.estimatedPrice > course.price && (
                      <span className="text-[14px] text-muted line-through">
                        {formatCoursePrice(course.estimatedPrice)}
                      </span>
                    )}
                    <span className="text-2xl font-semibold tracking-[-0.03em]">
                      {formatCoursePrice(course.price)}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] text-muted">{course.tags}</p>
                </div>
              </div>
            </div>
          </div>

          {sections.length > 0 && (
            <section className="animate-fade-up-delay-2 mt-14 border-t border-border pt-10">
              <p className="label mb-6">Curriculum preview</p>
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section.key}
                    className="rounded-[14px] border border-border bg-card p-4"
                  >
                    <p className="text-[14px] font-medium">{section.title}</p>
                    <ul className="mt-3 space-y-2">
                      {section.videos.map((video) => (
                        <li
                          key={video.key}
                          className="flex items-center justify-between text-[13px] text-muted"
                        >
                          <span>{video.title}</span>
                          <span>{formatVideoDuration(video.videoLength)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;
