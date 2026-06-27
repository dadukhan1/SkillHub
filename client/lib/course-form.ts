import type { AdminCourse, CoursePayload } from "@/redux/types/course";

export const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const VIDEO_PLAYERS = ["youtube", "vimeo", "custom"] as const;

export interface CourseVideoFormValues {
  key: string;
  title: string;
  videoUrl: string;
  videoLength: string;
  videoPlayer: string;
}

export interface CourseSectionFormValues {
  key: string;
  title: string;
  videos: CourseVideoFormValues[];
}

export interface CourseFormValues {
  name: string;
  description: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnailPreview: string;
  thumbnailBase64: string;
  benefits: string[];
  preRequisites: string[];
  sections: CourseSectionFormValues[];
}

export function createEmptyVideo(): CourseVideoFormValues {
  return {
    key: crypto.randomUUID(),
    title: "",
    videoUrl: "",
    videoLength: "",
    videoPlayer: "youtube",
  };
}

export function createEmptySection(): CourseSectionFormValues {
  return {
    key: crypto.randomUUID(),
    title: "",
    videos: [createEmptyVideo()],
  };
}

export function createEmptyCourseForm(): CourseFormValues {
  return {
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "Beginner",
    demoUrl: "",
    thumbnailPreview: "",
    thumbnailBase64: "",
    benefits: [""],
    preRequisites: [""],
    sections: [createEmptySection()],
  };
}

function parseCourseDataToSections(
  courseData: NonNullable<AdminCourse["courseData"]>,
): CourseSectionFormValues[] {
  const groups = new Map<string, NonNullable<AdminCourse["courseData"]>>();

  for (const item of courseData) {
    const groupKey = item.videoSection?.trim() || item.title?.trim() || "General";
    const existing = groups.get(groupKey) ?? [];
    existing.push(item);
    groups.set(groupKey, existing);
  }

  return Array.from(groups.entries()).map(([groupKey, items]) => ({
    key: crypto.randomUUID(),
    title: groupKey,
    videos: items.map((item) => ({
      key: item._id ?? crypto.randomUUID(),
      title: item.title ?? "",
      videoUrl: item.videoUrl ?? "",
      videoLength: item.videoLength != null ? String(item.videoLength) : "",
      videoPlayer: item.videoPlayer ?? "youtube",
    })),
  }));
}

export function courseToFormValues(course: AdminCourse): CourseFormValues {
  return {
    name: course.name,
    description: course.description,
    price: String(course.price),
    estimatedPrice: course.estimatedPrice ? String(course.estimatedPrice) : "",
    tags: course.tags,
    level: course.level,
    demoUrl: course.demoUrl,
    thumbnailPreview: course.thumbnail?.url ?? "",
    thumbnailBase64: "",
    benefits:
      course.benefits?.length && course.benefits.some((item) => item.title)
        ? course.benefits.map((item) => item.title)
        : [""],
    preRequisites:
      course.preRequisites?.length &&
      course.preRequisites.some((item) => item.title)
        ? course.preRequisites.map((item) => item.title)
        : [""],
    sections:
      course.courseData?.length
        ? parseCourseDataToSections(course.courseData)
        : [createEmptySection()],
  };
}

function sectionHasContent(section: CourseSectionFormValues): boolean {
  if (section.title.trim()) {
    return true;
  }

  return section.videos.some(
    (video) =>
      video.title.trim() ||
      video.videoUrl.trim() ||
      video.videoLength.trim(),
  );
}

function videoHasContent(video: CourseVideoFormValues): boolean {
  return Boolean(
    video.title.trim() || video.videoUrl.trim() || video.videoLength.trim(),
  );
}

export function validateCourseForm(
  values: CourseFormValues,
  mode: "create" | "edit",
): string | null {
  if (!values.name.trim()) return "Course name is required.";
  if (!values.description.trim()) return "Description is required.";
  if (!values.tags.trim()) return "Tags are required.";
  if (!values.level.trim()) return "Level is required.";
  if (!values.demoUrl.trim()) return "Demo URL is required.";

  const price = Number(values.price);
  if (!values.price.trim() || Number.isNaN(price) || price < 0) {
    return "Enter a valid price.";
  }

  if (values.estimatedPrice.trim()) {
    const estimatedPrice = Number(values.estimatedPrice);
    if (Number.isNaN(estimatedPrice) || estimatedPrice < 0) {
      return "Enter a valid estimated price.";
    }
  }

  if (mode === "create" && !values.thumbnailBase64 && !values.thumbnailPreview) {
    return "Course thumbnail is required.";
  }

  for (const section of values.sections) {
    if (!sectionHasContent(section)) continue;

    const sectionName = section.title.trim() || "Untitled section";

    if (!section.title.trim()) {
      return `"${sectionName}" needs a section name.`;
    }

    const activeVideos = section.videos.filter(videoHasContent);

    if (activeVideos.length === 0) {
      return `"${sectionName}" needs at least one video.`;
    }

    for (const video of activeVideos) {
      const videoName = video.title.trim() || "Untitled video";

      if (!video.title.trim()) {
        return `"${videoName}" in "${sectionName}" needs a name.`;
      }
      if (!video.videoUrl.trim()) {
        return `"${videoName}" in "${sectionName}" needs a video URL.`;
      }
      if (!video.videoLength.trim() || Number.isNaN(Number(video.videoLength))) {
        return `"${videoName}" in "${sectionName}" needs a valid duration in minutes.`;
      }
    }
  }

  return null;
}

export function formValuesToPayload(values: CourseFormValues): CoursePayload {
  const courseData = values.sections
    .filter(sectionHasContent)
    .flatMap((section) => {
      const sectionTitle = section.title.trim();

      return section.videos
        .filter(
          (video) =>
            video.title.trim() &&
            video.videoUrl.trim() &&
            video.videoLength.trim(),
        )
        .map((video) => ({
          title: video.title.trim(),
          description: "",
          videoUrl: video.videoUrl.trim(),
          videoSection: sectionTitle,
          videoLength: Number(video.videoLength),
          videoPlayer: video.videoPlayer,
          links: [],
          suggestion: "",
        }));
    });

  const payload: CoursePayload = {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    tags: values.tags.trim(),
    level: values.level,
    demoUrl: values.demoUrl.trim(),
    benefits: values.benefits
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title) => ({ title })),
    preRequisites: values.preRequisites
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title) => ({ title })),
    courseData,
  };

  if (values.estimatedPrice.trim()) {
    payload.estimatedPrice = Number(values.estimatedPrice);
  }

  if (values.thumbnailBase64) {
    payload.thumbnail = values.thumbnailBase64;
  }

  return payload;
}

// Backward-compatible aliases
export type CourseLessonFormValues = CourseSectionFormValues;
export const createEmptyLesson = createEmptySection;
