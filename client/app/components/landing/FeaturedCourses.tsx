import { FC } from "react";
import Link from "next/link";
import { featuredCourses } from "@/lib/mock-data";
import CourseCard from "../courses/CourseCard";
import SectionHeader from "../ui/SectionHeader";

const FeaturedCourses: FC = () => (
  <section id="courses" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          label="Featured"
          title="Courses crafted for excellence"
          description="Hand-picked by our team. Every course meets our standard for depth, clarity, and real-world relevance."
        />
        <Link
          href="#courses"
          className="shrink-0 text-[13px] font-medium text-accent transition-colors duration-200 hover:text-accent-hover"
        >
          View all →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCourses;
