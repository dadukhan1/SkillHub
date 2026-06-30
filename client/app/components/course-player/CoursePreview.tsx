/** @format */

"use client";

import { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CoursePlayerSidebar from "@/app/components/course-player/CoursePlayerSidebar";
import CourseVideoPlayer from "@/app/components/course-player/CourseVideoPlayer";
import Button from "@/app/components/ui/Button";
import {
  findVideoInCurriculum,
  formatVideoDuration,
  getDefaultVideoSelection,
  groupContentBySection,
} from "@/lib/course-curriculum";
import { formatCoursePrice } from "@/lib/course-utils";
import {
  useGetCourseContentQuery,
  useGetCourseQuery,
} from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import type { CourseLesson } from "@/redux/types/course";

interface CoursePreviewProps {
  courseId: string;
}

const CoursePreview: FC<CoursePreviewProps> = ({ courseId }) => {
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
  } = useGetCourseQuery(courseId);
  const {
    data: contentData,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useGetCourseContentQuery(courseId);

  const course = courseData?.course;
  const sections = useMemo(
    () => groupContentBySection(contentData?.content ?? []),
    [contentData?.content],
  );

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!sections.length) return;
    const defaultVideo = getDefaultVideoSelection(sections);
    setActiveVideoId(defaultVideo);
    if (defaultVideo) {
      const match = findVideoInCurriculum(sections, defaultVideo);
      if (match) {
        setCollapsedSections((current) => ({
          ...current,
          [sections[match.sectionIndex].key]: false,
        }));
      }
    }
  }, [sections]);

  const activeVideo = useMemo(() => {
    for (const section of sections) {
      const found = section.videos.find(
        (video) => video.key === activeVideoId || video._id === activeVideoId,
      );
      if (found) return found;
    }
    return null;
  }, [sections, activeVideoId]);

  const selectVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    const match = findVideoInCurriculum(sections, videoId);
    if (match) {
      setCollapsedSections((current) => ({
        ...current,
        [sections[match.sectionIndex].key]: false,
      }));
    }
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [sectionKey]: !(current[sectionKey] ?? true),
    }));
  };

  const isLoading = isCourseLoading || isContentLoading;
  const isError = isCourseError || isContentError;
  const error = courseError ?? contentError;

  if (isLoading) {
    return (
      <div className='flex min-h-[320px] items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground' />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className='rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center'>
        <p className='text-sm text-red-500'>
          {getErrorMessage(error, "Unable to load course preview.")}
        </p>
        <Link href='/dashboard/courses' className='mt-4 inline-block'>
          <Button variant='secondary' size='sm'>
            Back to courses
          </Button>
        </Link>
      </div>
    );
  }

  const totalVideos = contentData?.content?.length ?? 0;

  return (
    <div className='space-y-8'>
      <div className='animate-fade-up flex flex-col gap-4 rounded-[14px] border border-accent/20 bg-accent-muted/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='label mb-1'>Course preview</p>
          <p className='text-[14px] text-muted'>
            Review how your course and videos appear before publishing changes.
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Link href='/dashboard/courses'>
            <Button variant='secondary' size='sm'>
              All courses
            </Button>
          </Link>
          <Link href={`/courses/${courseId}/learn`}>
            <Button variant='secondary' size='sm'>
              Open player
            </Button>
          </Link>
          <Link href={`/dashboard/courses/${courseId}/edit`}>
            <Button size='sm'>Edit course</Button>
          </Link>
        </div>
      </div>

      <div className='animate-fade-up grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-10'>
        <div className='min-w-0'>
          <p className='label mb-3'>{course.level}</p>
          <h1 className='text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[2rem]'>
            {course.name}
          </h1>
          <p className='mt-4 text-[15px] leading-[1.65] text-muted'>
            {course.description}
          </p>

          <div className='mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6 sm:max-w-sm'>
            <div>
              <p className='text-lg font-semibold tabular-nums'>
                {sections.length}
              </p>
              <p className='mt-0.5 text-[12px] text-muted'>Sections</p>
            </div>
            <div>
              <p className='text-lg font-semibold tabular-nums'>
                {totalVideos}
              </p>
              <p className='mt-0.5 text-[12px] text-muted'>Videos</p>
            </div>
            <div>
              <p className='text-lg font-semibold tabular-nums'>
                {formatCoursePrice(course.price)}
              </p>
              <p className='mt-0.5 text-[12px] text-muted'>Price</p>
            </div>
          </div>
        </div>

        <div className='relative aspect-[16/10] overflow-hidden rounded-[14px] border border-border bg-surface lg:aspect-auto lg:h-44'>
          {course.thumbnail?.url ? (
            <Image
              src={course.thumbnail.url}
              alt=''
              fill
              className='object-cover'
              sizes='280px'
            />
          ) : (
            <div className='flex h-full min-h-[140px] items-center justify-center text-[13px] text-muted'>
              No thumbnail
            </div>
          )}
        </div>
      </div>

      {activeVideo ? (
        <div className='animate-fade-up-delay-1 grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-8'>
          <div className='min-w-0'>
            <p className='label mb-2'>{activeVideo.videoSection || "Video"}</p>
            <h2 className='mb-4 text-[1.25rem] font-semibold tracking-[-0.02em]'>
              {activeVideo.title}
            </h2>
            <CourseVideoPlayer
              videoId={activeVideo.videoUrl}
              title={activeVideo.title}
            />
            {activeVideo.description && (
              <p className='mt-4 text-[14px] leading-relaxed text-muted'>
                {activeVideo.description}
              </p>
            )}
          </div>

          <div className='min-h-[320px] overflow-hidden rounded-[14px] border border-border lg:min-h-[480px]'>
            <CoursePlayerSidebar
              sections={sections}
              activeVideoId={activeVideoId}
              collapsedSections={collapsedSections}
              onToggleSection={toggleSection}
              onSelectVideo={selectVideo}
            />
          </div>
        </div>
      ) : (
        <div className='animate-fade-up-delay-1 rounded-[14px] border border-dashed border-border bg-card px-6 py-12 text-center'>
          <p className='text-sm text-muted'>
            No videos added to this course yet.
          </p>
          <Link
            href={`/dashboard/courses/${courseId}/edit`}
            className='mt-4 inline-block'
          >
            <Button size='sm'>Add videos</Button>
          </Link>
        </div>
      )}

      {sections.length > 0 && (
        <section className='animate-fade-up-delay-2 border-t border-border pt-8'>
          <p className='label mb-4'>Full curriculum</p>
          <div className='grid gap-3 sm:grid-cols-2'>
            {sections.map((section) => (
              <div
                key={section.key}
                className='rounded-[14px] border border-border bg-card p-4'
              >
                <p className='text-[14px] font-medium'>{section.title}</p>
                <ul className='mt-3 space-y-2'>
                  {section.videos.map((video) => (
                    <li key={video.key}>
                      <button
                        type='button'
                        onClick={() => selectVideo(video.key)}
                        className='flex w-full items-center justify-between rounded-[8px] px-2 py-1.5 text-left text-[13px] text-muted transition-colors hover:bg-surface hover:text-foreground'
                      >
                        <span className='truncate pr-3'>{video.title}</span>
                        <span className='shrink-0 tabular-nums'>
                          {formatVideoDuration(video.videoLength)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CoursePreview;
