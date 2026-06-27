"use client";

import { FC, useMemo } from "react";
import Link from "next/link";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminRecentCourses from "@/app/components/admin/AdminRecentCourses";
import AdminStats from "@/app/components/admin/AdminStats";
import Button from "@/app/components/ui/Button";
import {
  formatCoursePrice,
  getCourseStats,
} from "@/lib/course-utils";
import { useAuth } from "@/redux/hooks";
import { useGetAdminCoursesQuery } from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { getFirstName } from "@/lib/user";

const AdminDashboardPage: FC = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetAdminCoursesQuery();

  const courses = data?.courses ?? [];
  const stats = useMemo(() => getCourseStats(courses), [courses]);
  const firstName = user ? getFirstName(user.name) : "Admin";

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (isError) {
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">
          {getErrorMessage(error, "Failed to load dashboard data.")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        label="Admin dashboard"
        title={
          <>
            Welcome back, {firstName}.
            <br />
            <span className="text-muted">Manage with clarity.</span>
          </>
        }
        description="Your control center for SkillHub. Start with courses today — users, analytics, and settings modules are on the way."
        actions={
          <Link href="/dashboard/courses">
            <Button size="sm">Manage courses</Button>
          </Link>
        }
      />

      <AdminStats
        stats={[
          { value: String(stats.totalCourses), label: "Total courses" },
          { value: stats.totalEnrollments.toLocaleString(), label: "Total enrollments" },
          {
            value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—",
            label: "Avg. rating",
          },
          {
            value: formatCoursePrice(stats.totalRevenue),
            label: "Catalog revenue",
          },
        ]}
      />

      <section className="animate-fade-up-delay-2 mt-10">
        <AdminRecentCourses courses={courses} />
      </section>

      <section className="animate-fade-up-delay-3 mt-10 border-t border-border pt-10">
        <p className="label mb-6">Platform modules</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Courses", href: "/dashboard/courses", enabled: true },
            { label: "Users", href: "/dashboard/users", enabled: false },
            { label: "Analytics", href: "/dashboard/analytics", enabled: false },
            { label: "Settings", href: "/dashboard/settings", enabled: false },
          ].map((module) => (
            <div
              key={module.label}
              className="rounded-[14px] border border-border bg-card p-5"
            >
              <p className="text-[15px] font-medium">{module.label}</p>
              <p className="mt-1 text-[13px] text-muted">
                {module.enabled ? "Available now" : "Coming soon"}
              </p>
              {module.enabled ? (
                <Link
                  href={module.href}
                  className="mt-4 inline-block text-[13px] text-muted transition-colors hover:text-foreground"
                >
                  Open module →
                </Link>
              ) : (
                <span className="mt-4 inline-block text-[13px] text-muted-foreground">
                  In development
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
