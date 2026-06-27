/** @format */

"use client";

import { FC, useMemo, useState } from "react";
import Link from "next/link";
import AdminCoursesTable from "@/app/components/admin/AdminCoursesTable";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminSearchInput from "@/app/components/admin/AdminSearchInput";
import Button from "@/app/components/ui/Button";
import { filterCourses } from "@/lib/course-utils";
import { useGetAdminCoursesQuery } from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

const AdminCoursesPage: FC = () => {
  const { data, isLoading, isError, error } = useGetAdminCoursesQuery();
  const [search, setSearch] = useState("");

  const courses = data?.courses ?? [];
  const filteredCourses = useMemo(
    () => filterCourses(courses, search),
    [courses, search],
  );

  if (isLoading) {
    return <AdminLoadingState label='Loading courses…' />;
  }

  if (isError) {
    return (
      <div className='rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center'>
        <p className='text-sm text-red-500'>
          {getErrorMessage(error, "Failed to load courses.")}
        </p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <AdminPageHeader
        label='Courses module'
        title={
          <>
            Manage your catalog.
            <br />
            <span className='text-muted'>Ship with clarity.</span>
          </>
        }
        description='Create, review, and maintain every course in one place. Search your catalog, track performance, and keep content up to date.'
        actions={
          <Link href='/dashboard/courses/new'>
            <Button size='sm'>New course</Button>
          </Link>
        }
      />

      <div className='animate-fade-up-delay-2 mt-8 space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder='Search by name, tag, or level…'
            className='sm:max-w-md'
          />
          <p className='text-[13px] text-muted'>
            {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        <AdminCoursesTable courses={filteredCourses} />
      </div>
    </div>
  );
};

export default AdminCoursesPage;
