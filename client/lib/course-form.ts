import type { AdminCourse, CoursePayload } from "@/redux/types/course";

export const COURSE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const VIDEO_PLAYERS = ["youtube", "vimeo", "custom"] as const;

export interface CourseLessonFormValues {
  key: string;
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: string;
  videoPlayer: string;
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
  courseData: CourseLessonFormValues[];
}

export function createEmptyLesson(): CourseLessonFormValues {
  return {
    key: crypto.randomUUID(),
    title: "",
    description: "",
    videoUrl: "",
    videoSection: "Introduction",
    videoLength: "",
    videoPlayer: "youtube",
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
    courseData: [createEmptyLesson()],
  };
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
    courseData:
      course.courseData?.length
        ? course.courseData.map((lesson) => ({
            key: lesson._id ?? crypto.randomUUID(),
            title: lesson.title ?? "",
            description: lesson.description ?? "",
            videoUrl: lesson.videoUrl ?? "",
            videoSection: lesson.videoSection ?? "Introduction",
            videoLength:
              lesson.videoLength != null ? String(lesson.videoLength) : "",
            videoPlayer: lesson.videoPlayer ?? "youtube",
          }))
        : [createEmptyLesson()],
  };
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

  const hasIncompleteLesson = values.courseData.some(
    (lesson) =>
      lesson.title.trim() ||
      lesson.description.trim() ||
      lesson.videoUrl.trim() ||
      lesson.videoLength.trim(),
  );

  if (hasIncompleteLesson) {
    for (const [index, lesson] of values.courseData.entries()) {
      const hasAnyField =
        lesson.title.trim() ||
        lesson.description.trim() ||
        lesson.videoUrl.trim() ||
        lesson.videoSection.trim() ||
        lesson.videoLength.trim();

      if (!hasAnyField) continue;

      if (!lesson.title.trim()) {
        return `Lesson ${index + 1} needs a title.`;
      }
      if (!lesson.description.trim()) {
        return `Lesson ${index + 1} needs a description.`;
      }
      if (!lesson.videoUrl.trim()) {
        return `Lesson ${index + 1} needs a video URL.`;
      }
      if (!lesson.videoLength.trim() || Number.isNaN(Number(lesson.videoLength))) {
        return `Lesson ${index + 1} needs a valid duration in minutes.`;
      }
    }
  }

  return null;
}

export function formValuesToPayload(values: CourseFormValues): CoursePayload {
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
    courseData: values.courseData
      .filter(
        (lesson) =>
          lesson.title.trim() &&
          lesson.description.trim() &&
          lesson.videoUrl.trim() &&
          lesson.videoLength.trim(),
      )
      .map((lesson) => ({
        title: lesson.title.trim(),
        description: lesson.description.trim(),
        videoUrl: lesson.videoUrl.trim(),
        videoSection: lesson.videoSection.trim() || "General",
        videoLength: Number(lesson.videoLength),
        videoPlayer: lesson.videoPlayer,
        links: [],
        suggestion: "",
      })),
  };

  if (values.estimatedPrice.trim()) {
    payload.estimatedPrice = Number(values.estimatedPrice);
  }

  if (values.thumbnailBase64) {
    payload.thumbnail = values.thumbnailBase64;
  }

  return payload;
}
