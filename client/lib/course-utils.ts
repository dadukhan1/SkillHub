import type { AdminCourse } from "@/redux/types/course";

export function formatCoursePrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatCourseDate(date?: string): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getCourseLessonCount(course: AdminCourse): number {
  return course.courseData?.length ?? 0;
}

export function getCourseStats(courses: AdminCourse[]) {
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce(
    (sum, course) => sum + (course.purchased ?? 0),
    0,
  );
  const ratedCourses = courses.filter((course) => (course.ratings ?? 0) > 0);
  const avgRating =
    ratedCourses.length > 0
      ? ratedCourses.reduce((sum, course) => sum + (course.ratings ?? 0), 0) /
        ratedCourses.length
      : 0;
  const totalRevenue = courses.reduce(
    (sum, course) => sum + (course.purchased ?? 0) * course.price,
    0,
  );

  return { totalCourses, totalEnrollments, avgRating, totalRevenue };
}

export function filterCourses(courses: AdminCourse[], query: string): AdminCourse[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return courses;

  return courses.filter((course) => {
    const haystack = [
      course.name,
      course.description,
      course.tags,
      course.level,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
