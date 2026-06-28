/** @format */

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
      <div className='flex h-dvh items-center justify-center bg-background'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground' />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className='flex h-dvh items-center justify-center bg-background px-6'>
        <p className='text-sm text-red-500'>
          {getErrorMessage(error, "Course not found.")}
        </p>
      </div>
    );
  }

  return (
    <div className='flex h-dvh max-h-dvh flex-col overflow-hidden bg-background'>
      {/* Header */}
      <header className='flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-background/80 backdrop-blur-md z-50 px-4 sm:px-8'>
        <Link
          href='/'
          className='text-[15px] font-bold tracking-tight transition-opacity hover:opacity-70'
        >
          SkillHub
        </Link>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <UserProfileMenu variant='header' compact />
        </div>
      </header>

      <main className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
        {/* Premium Hero Section */}
        <div className='bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-50 pointer-events-none'></div>
          <div className='mx-auto max-w-6xl px-4 sm:px-8 relative z-10 lg:pr-[420px]'>
            <div className='animate-fade-up'>
              <span className='inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-300 border border-primary/30 text-[13px] font-semibold mb-6'>
                {course.level}
              </span>
              <h1 className='text-[2.25rem] font-bold leading-[1.1] tracking-tight sm:text-[3rem] text-white'>
                {course.name}
              </h1>

              <div className='mt-6 flex flex-wrap items-center gap-4 text-[14px]'>
                <div className='flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full'>
                  <span className='font-semibold text-yellow-400'>
                    {(course.ratings ?? 0).toFixed(1)}
                  </span>
                  <div className='flex items-center gap-0.5'>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = course.ratings ?? 0;
                      const isFull = rating >= star;
                      const isHalf = rating >= star - 0.5 && rating < star;
                      return (
                        <svg
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            isFull || isHalf
                              ? "text-yellow-400"
                              : "text-white/20"
                          }`}
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      );
                    })}
                  </div>
                  <span className='text-white/70 ml-1'>
                    ({course.reviews?.length ?? 0} reviews)
                  </span>
                </div>
                <div className='flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full'>
                  <span className='text-white/90'>
                    {course.purchased ?? 0} students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className='mx-auto max-w-6xl px-4 sm:px-8 py-10 lg:py-14 pb-24'>
          <div className='grid gap-10 lg:grid-cols-[1fr_380px] items-start relative'>
            {/* Left Column: Main Content */}
            <div className='space-y-12 order-2 lg:order-1'>
              {/* Description */}
              <section className='animate-fade-up-delay-1'>
                <h2 className='text-2xl font-bold tracking-tight mb-4'>
                  About this course
                </h2>
                <div className='text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line'>
                  {course.description}
                </div>
              </section>

              {/* Benefits & Prerequisites */}
              <div className='animate-fade-up-delay-1 grid sm:grid-cols-2 gap-6'>
                {course.benefits && course.benefits.length > 0 && (
                  <div className='rounded-[16px] bg-card p-6 border border-border shadow-sm'>
                    <h3 className='text-lg font-bold mb-4'>
                      What you'll learn
                    </h3>
                    <ul className='space-y-3'>
                      {course.benefits.map((b, i) => (
                        <li
                          key={i}
                          className='flex gap-3 text-[14px] text-muted-foreground'
                        >
                          <svg
                            className='h-5 w-5 shrink-0 text-emerald-500'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                          <span className='pt-0.5'>{b.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.preRequisites && course.preRequisites.length > 0 && (
                  <div className='rounded-[16px] bg-card p-6 border border-border shadow-sm'>
                    <h3 className='text-lg font-bold mb-4'>Requirements</h3>
                    <ul className='space-y-3'>
                      {course.preRequisites.map((p, i) => (
                        <li
                          key={i}
                          className='flex gap-3 text-[14px] text-muted-foreground'
                        >
                          <span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary' />
                          <span className='pt-0.5'>{p.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Course Curriculum */}
              {sections.length > 0 && (
                <section className='animate-fade-up-delay-2'>
                  <div className='flex items-end justify-between mb-6'>
                    <h2 className='text-2xl font-bold tracking-tight'>
                      Course Curriculum
                    </h2>
                    <p className='text-sm text-muted-foreground mb-1'>
                      {sections.length} sections • {totalVideos} videos
                    </p>
                  </div>

                  <div className='space-y-3'>
                    {sections.map((section, index) => {
                      const isOpen = openSections[section.key] ?? index === 0;

                      return (
                        <div
                          key={section.key}
                          className='rounded-[12px] border border-border bg-card overflow-hidden shadow-sm'
                        >
                          <button
                            onClick={() => toggleSection(section.key)}
                            className='flex w-full items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors'
                          >
                            <div>
                              <p className='text-[15px] font-semibold text-foreground'>
                                {section.title}
                              </p>
                              <p className='text-[13px] text-muted-foreground mt-1'>
                                {section.videos.length} videos
                              </p>
                            </div>
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            >
                              <svg
                                width='12'
                                height='12'
                                viewBox='0 0 15 15'
                                fill='none'
                              >
                                <path
                                  d='M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z'
                                  fill='currentColor'
                                  fillRule='evenodd'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </span>
                          </button>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen
                                ? "grid-rows-[1fr] opacity-100 border-t border-border"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className='overflow-hidden'>
                              <ul className='divide-y divide-border/40 bg-background/50'>
                                {section.videos.map((video, idx) => (
                                  <li
                                    key={video.key}
                                    className='flex items-start justify-between gap-4 p-4 sm:px-5 hover:bg-muted/20 transition-colors'
                                  >
                                    <div className='flex gap-3'>
                                      <svg
                                        className='w-5 h-5 text-primary/70 shrink-0 mt-0.5'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                      >
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={1.5}
                                          d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
                                        />
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={1.5}
                                          d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                      </svg>
                                      <span className='text-[14px] text-foreground/90 font-medium'>
                                        {video.title}
                                      </span>
                                    </div>
                                    <span className='text-[13px] text-muted-foreground shrink-0 pt-0.5 font-medium'>
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

              {/* Reviews Section */}
              <section className='animate-fade-up-delay-3 pt-6 border-t border-border'>
                <CourseReviews courseId={courseId} hideForm={true} />
              </section>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className='lg:-mt-40 -mt-7 sm:-mt-6 lg:sticky lg:top-24 z-20 order-1 lg:order-2'>
              <div className='overflow-hidden rounded-[20px] border border-border/80 bg-card shadow-xl backdrop-blur-sm'>
                <div className='relative bg-muted'>
                  {showVideo ? (
                    <CourseVideoPlayer
                      videoId={course.demoUrl}
                      title={course.name}
                    />
                  ) : (
                    <div className='relative aspect-video'>
                      {course.thumbnail?.url ? (
                        <Image
                          src={course.thumbnail.url}
                          alt=''
                          fill
                          className='object-cover'
                          sizes='(max-width: 1024px) 100vw, 400px'
                        />
                      ) : (
                        <div className='flex h-full items-center justify-center text-[13px] text-muted-foreground'>
                          No thumbnail
                        </div>
                      )}
                      {course.demoUrl && (
                        <div
                          className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-all hover:bg-black/50 group'
                          onClick={() => setShowVideo(true)}
                        >
                          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md group-hover:scale-110 transition-transform'>
                            <svg
                              className='h-8 w-8 text-white ml-1'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M8 5v14l11-7z' />
                            </svg>
                          </div>
                          <span className='absolute bottom-4 font-medium text-white text-sm bg-black/60 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
                            Preview this course
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className='p-6'>
                  <div className='flex items-end gap-3 mb-6'>
                    <span className='text-[2rem] font-bold tracking-tight leading-none text-foreground'>
                      {formatCoursePrice(course.price)}
                    </span>
                    {course.estimatedPrice &&
                      course.estimatedPrice > course.price && (
                        <span className='text-[1.125rem] text-muted-foreground line-through font-medium pb-0.5'>
                          {formatCoursePrice(course.estimatedPrice)}
                        </span>
                      )}
                  </div>

                  <div className='flex flex-col gap-3'>
                    {hasAccess ? (
                      <Link
                        href={`/courses/${courseId}/learn`}
                        className='w-full'
                      >
                        <Button
                          size='lg'
                          className='w-full h-12 text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground'
                        >
                          Go to course
                        </Button>
                      </Link>
                    ) : user ? (
                      <Button
                        size='lg'
                        className='w-full h-12 text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                        onClick={handleEnroll}
                        disabled={isPaymentLoading || course.price <= 0}
                      >
                        {isPaymentLoading
                          ? "Preparing checkout..."
                          : "Enroll Now"}
                      </Button>
                    ) : (
                      <Link
                        href={`/signin?redirect=/courses/${courseId}`}
                        className='w-full'
                      >
                        <Button
                          size='lg'
                          className='w-full h-12 text-[15px] font-semibold'
                        >
                          Sign in to enroll
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className='mt-8 space-y-4'>
                    <p className='text-[15px] font-bold text-foreground'>
                      This course includes:
                    </p>
                    <ul className='space-y-3 text-[14px] text-muted-foreground'>
                      <li className='flex items-center gap-3'>
                        <svg
                          className='w-5 h-5 text-foreground/70'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                          />
                        </svg>
                        {totalVideos} on-demand video lessons
                      </li>
                      <li className='flex items-center gap-3'>
                        <svg
                          className='w-5 h-5 text-foreground/70'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                          />
                        </svg>
                        {sections.length} comprehensive sections
                      </li>
                      <li className='flex items-center gap-3'>
                        <svg
                          className='w-5 h-5 text-foreground/70'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                          />
                        </svg>
                        Full lifetime access
                      </li>
                      <li className='flex items-center gap-3'>
                        <svg
                          className='w-5 h-5 text-foreground/70'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                          />
                        </svg>
                        Access on mobile and desktop
                      </li>
                    </ul>
                  </div>

                  <div className='mt-6 pt-6 border-t border-border flex flex-wrap gap-2'>
                    {course.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className='inline-block px-3 py-1 bg-muted text-muted-foreground text-[12px] rounded-full font-medium border border-border/50'
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailPage;
