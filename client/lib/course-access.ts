import type { User } from "@/redux/types/auth";
import { isAdmin } from "@/lib/user";

export function userHasCourseAccess(user: User | null, courseId: string): boolean {
  if (!user) return false;
  if (isAdmin(user.role)) return true;
  return user.courses.some((course) => course.courseId === courseId);
}
