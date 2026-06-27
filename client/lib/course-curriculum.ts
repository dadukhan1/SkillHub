import type { CourseLesson, CurriculumSection } from "@/redux/types/course";

export function groupContentBySection(content: CourseLesson[]): CurriculumSection[] {
  const groups = new Map<string, CourseLesson[]>();

  for (const item of content) {
    const groupKey = item.videoSection?.trim() || item.title?.trim() || "General";
    const existing = groups.get(groupKey) ?? [];
    existing.push(item);
    groups.set(groupKey, existing);
  }

  return Array.from(groups.entries()).map(([title, videos]) => ({
    key: title,
    title,
    videos: videos.map((video) => ({
      ...video,
      key: video._id ?? `${title}-${video.title}`,
    })),
  }));
}

export function formatVideoDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function findVideoInCurriculum(
  sections: CurriculumSection[],
  videoId: string | null,
): { sectionIndex: number; videoIndex: number } | null {
  if (!videoId) return null;

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const videoIndex = sections[sectionIndex].videos.findIndex(
      (video) => video.key === videoId || video._id === videoId,
    );
    if (videoIndex >= 0) return { sectionIndex, videoIndex };
  }

  return null;
}

export function getDefaultVideoSelection(sections: CurriculumSection[]): string | null {
  const firstVideo = sections[0]?.videos[0];
  return firstVideo?.key ?? firstVideo?._id ?? null;
}
