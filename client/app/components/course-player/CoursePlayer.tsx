/** @format */

"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CoursePlayerShell from "@/app/components/course-player/CoursePlayerShell";
import CoursePlayerSidebar from "@/app/components/course-player/CoursePlayerSidebar";
import CourseVideoPlayer from "@/app/components/course-player/CourseVideoPlayer";
import CourseReviews from "@/app/components/course-player/CourseReviews";
import VideoQA from "@/app/components/course-player/VideoQA";
import Button from "@/app/components/ui/Button";
import {
  findVideoInCurriculum,
  getDefaultVideoSelection,
  groupContentBySection,
} from "@/lib/course-curriculum";
import { useGetCourseContentQuery } from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import type { CourseLesson } from "@/redux/types/course";

interface CoursePlayerProps {
  courseId: string;
}

const CoursePlayer: FC<CoursePlayerProps> = ({ courseId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, isError, error } =
    useGetCourseContentQuery(courseId);

  const sections = useMemo(
    () => groupContentBySection(data?.content ?? []),
    [data?.content],
  );

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sections.length) return;

    const requestedVideo = searchParams.get("video");
    const match = findVideoInCurriculum(sections, requestedVideo);
    const defaultVideo = getDefaultVideoSelection(sections);
    setActiveVideoId(match ? requestedVideo : defaultVideo);

    if (match) {
      setCollapsedSections((current) => ({
        ...current,
        [sections[match.sectionIndex].key]: false,
      }));
    }
  }, [sections, searchParams]);

  const activeVideo = useMemo(() => {
    for (const section of sections) {
      const found = section.videos.find(
        (video) => video.key === activeVideoId || video._id === activeVideoId,
      );
      if (found) return found;
    }
    return null;
  }, [sections, activeVideoId]);

  const flatVideos = useMemo(
    () => sections.flatMap((section) => section.videos),
    [sections],
  );

  const activeIndex = activeVideo
    ? flatVideos.findIndex(
        (video) =>
          video.key === activeVideo.key || video._id === activeVideo._id,
      )
    : -1;

  const goToVideo = (videoId: string) => {
    setActiveVideoId(videoId);
    setSidebarOpen(false);
    router.replace(`/courses/${courseId}/learn?video=${videoId}`, {
      scroll: false,
    });
  };

  const goToAdjacent = (direction: -1 | 1) => {
    const next = flatVideos[activeIndex + direction];
    if (next) goToVideo(next.key);
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [sectionKey]: !(current[sectionKey] ?? true),
    }));
  };

  if (isLoading) {
    return (
      <div className='flex h-dvh items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground' />
          <p className='mt-4 text-sm text-muted'>Loading course player…</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.course) {
    return (
      <div className='flex h-dvh items-center justify-center bg-background px-6'>
        <div className='max-w-md text-center'>
          <p className='text-sm text-red-500'>
            {getErrorMessage(error, "Unable to load this course.")}
          </p>
          <Button
            variant='secondary'
            size='sm'
            className='mt-4'
            onClick={() => router.push(`/courses/${courseId}`)}
          >
            Back to course
          </Button>
        </div>
      </div>
    );
  }

  if (!activeVideo) {
    return (
      <CoursePlayerShell courseName={data.course.name} courseId={courseId}>
        <div className='flex h-full items-center justify-center px-6'>
          <p className='text-sm text-muted'>This course has no videos yet.</p>
        </div>
      </CoursePlayerShell>
    );
  }

  return (
    <CoursePlayerShell courseName={data.course.name} courseId={courseId}>
      <div className='flex h-full min-h-0'>
        {sidebarOpen && (
          <button
            type='button'
            aria-label='Close curriculum'
            className='fixed inset-0 z-40 bg-black/40 lg:hidden'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed bottom-0 left-0 top-14 z-50 w-72 transition-transform duration-300 lg:static lg:top-auto lg:z-auto lg:w-80 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <CoursePlayerSidebar
            sections={sections}
            activeVideoId={activeVideoId}
            collapsedSections={collapsedSections}
            onToggleSection={toggleSection}
            onSelectVideo={goToVideo}
          />
        </div>

        <main className='min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain'>
          <div className='mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8'>
            <div className='mb-4 flex items-center justify-between gap-3 lg:hidden'>
              <button
                type='button'
                onClick={() => setSidebarOpen(true)}
                className='rounded-[10px] border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground'
              >
                Curriculum
              </button>
            </div>

            <div className='animate-fade-up'>
              <p className='label mb-3'>
                {activeVideo.videoSection || "Lesson"}
              </p>
              <h1 className='text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[1.75rem]'>
                {activeVideo.title}
              </h1>
            </div>

            <div className='animate-fade-up-delay-1 mt-6'>
              <CourseVideoPlayer
                videoId={activeVideo.videoUrl}
                title={activeVideo.title}
              />
            </div>

            <div className='animate-fade-up-delay-2 mt-6 flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:justify-between'>
              <Button
                variant='secondary'
                size='sm'
                disabled={activeIndex <= 0}
                onClick={() => goToAdjacent(-1)}
              >
                Previous video
              </Button>
              <Button
                size='sm'
                disabled={activeIndex >= flatVideos.length - 1}
                onClick={() => goToAdjacent(1)}
              >
                Next video
              </Button>
            </div>

            {/* Q&A Section */}
            <div className='animate-fade-up-delay-3 mt-6'>
              <VideoQA
                courseId={courseId}
                contentId={activeVideo._id ?? activeVideo.key}
                questions={activeVideo.questions || []}
              />
            </div>

            {activeVideo.description && (
              <p className='animate-fade-up-delay-4 mt-6 text-[15px] leading-[1.65] text-muted'>
                {activeVideo.description}
              </p>
            )}
            

            <CourseReviews courseId={courseId} hideList={true} />
          </div>
        </main>
      </div>
    </CoursePlayerShell>
  );
};

export default CoursePlayer;
