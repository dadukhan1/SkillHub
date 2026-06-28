"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/app/components/ui/Button";
import ThemeToggle from "@/app/components/ThemeToggle";
import UserProfileMenu from "@/app/components/layout/UserProfileMenu";
import CourseVideoPlayer from "@/app/components/course-player/CourseVideoPlayer";
import CourseReviews from "@/app/components/course-player/CourseReviews";
import { userHasCourseAccess } from "@/lib/course-access";
import {
  formatVideoDuration,
  groupContentBySection,
} from "@/lib/course-curriculum";
import { formatCoursePrice } from "@/lib/course-utils";
import { useAuth } from "@/redux/hooks";
import { useGetCourseQuery } from "@/redux/features/courseApiSlice";
import { useCreateCheckoutSessionMutation } from "@/redux/features/ordersApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import toast from "react-hot-toast";

const CourseDetailPage: FC = () => {
  const params = useParams<{ id: string }>();
  const courseId = params?.id ?? "";
  const { user } = useAuth();
  const [showVideo, setShowVideo] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [createCheckoutSession, { isLoading: isPaymentLoading }] =
    useCreateCheckoutSessionMutation();

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

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEnroll = async () => {
    if (!course || course.price <= 0) return;

    try {
      const res = await createCheckoutSession({ courseId }).unwrap();
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to start checkout."));
    }
  };

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

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-20">
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

              {/* Benefits & Pre-requisites */}
              <div className="mt-8 flex flex-col gap-6 sm:flex-row">
                {course.benefits && course.benefits.length > 0 && (
                  <div className="flex-1 rounded-[14px] bg-card p-5 border border-border">
                    <p className="text-[14px] font-semibold mb-3">What you'll learn</p>
                    <ul className="space-y-2">
                      {course.benefits.map((b, i) => (
                        <li key={i} className="flex gap-2 text-[13px] text-muted">
                          <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{b.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {course.preRequisites && course.preRequisites.length > 0 && (
                  <div className="flex-1 rounded-[14px] bg-card p-5 border border-border">
                    <p className="text-[14px] font-semibold mb-3">Requirements</p>
                    <ul className="space-y-2">
                      {course.preRequisites.map((p, i) => (
                        <li key={i} className="flex gap-2 text-[13px] text-muted">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                          <span>{p.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

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
                  <div className="flex items-center gap-1.5 h-[28px]">
                    <span className="text-xl font-semibold tracking-[-0.02em] leading-none">
                      {(course.ratings ?? 0).toFixed(1)}
                    </span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = course.ratings ?? 0;
                        const isFull = rating >= star;
                        const isHalf = rating >= star - 0.5 && rating < star;
                        return (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              isFull || isHalf ? "text-yellow-400" : "text-muted-foreground/30"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        );
                      })}
                    </div>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">
                    Rating {course.reviews && course.reviews.length > 0 ? `(${course.reviews.length} reviews)` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {hasAccess ? (
                  <Link href={`/courses/${courseId}/learn`}>
                    <Button size="lg">Start learning</Button>
                  </Link>
                ) : user ? (
                  <Button
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isPaymentLoading || course.price <= 0}
                  >
                    {isPaymentLoading ? "Preparing checkout..." : "Enroll to start"}
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
              <div className="overflow-hidden rounded-[16px] border border-border bg-card shadow-soft sticky top-4">
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
              <p className="label mb-6">Course Curriculum</p>
              <div className="max-w-3xl space-y-3">
                {sections.map((section, index) => {
                  const isOpen = openSections[section.key] ?? (index === 0);
                  
                  return (
                    <div
                      key={section.key}
                      className="rounded-[14px] border border-border bg-card overflow-hidden"
                    >
                      <button 
                        onClick={() => toggleSection(section.key)}
                        className="flex w-full items-center justify-between p-4 sm:p-5 text-left hover:bg-border/30 transition-colors"
                      >
                        <div>
                          <p className="text-[14px] font-medium text-foreground">{section.title}</p>
                          <p className="text-[12px] text-muted mt-0.5">{section.videos.length} videos</p>
                        </div>
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted transition-transform duration-300 ${isOpen ? "rotate-180 bg-border/50" : ""}`}>
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                            <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100 border-t border-border" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="divide-y divide-border/50">
                            {section.videos.map((video, idx) => (
                              <li
                                key={video.key}
                                className="flex items-start justify-between gap-4 p-4 sm:px-5 hover:bg-border/20 transition-colors"
                              >
                                <div className="flex gap-3">
                                  <span className="text-[13px] text-muted-foreground w-4 text-right pt-0.5">{idx + 1}.</span>
                                  <span className="text-[13px] text-foreground font-medium">{video.title}</span>
                                </div>
                                <span className="text-[12px] text-muted shrink-0 pt-0.5">
                                  {formatVideoDuration(video.videoLength)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <CourseReviews courseId={courseId} hideForm={true} />
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;
