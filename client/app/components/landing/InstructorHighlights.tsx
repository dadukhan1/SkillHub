import { FC } from "react";
import { instructors } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import Avatar from "../ui/Avatar";
import SectionHeader from "../ui/SectionHeader";

const InstructorHighlights: FC = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeader
        label="Instructors"
        title="Learn from the best"
        description="Industry practitioners who ship real products. Experts with proven track records."
        className="mb-14"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="rounded-[16px] border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-soft"
          >
            <Avatar initials={instructor.avatar} size="lg" className="mb-5" />

            <h3 className="text-[15px] font-medium tracking-[-0.01em]">{instructor.name}</h3>
            <p className="mt-1 text-[13px] text-muted">{instructor.role}</p>

            <div className="mt-6 flex gap-8 border-t border-border pt-5 text-[13px]">
              <div>
                <p className="font-medium tabular-nums">{formatNumber(instructor.students)}</p>
                <p className="mt-0.5 text-muted">Students</p>
              </div>
              <div>
                <p className="font-medium tabular-nums">{instructor.courses}</p>
                <p className="mt-0.5 text-muted">Courses</p>
              </div>
              <div>
                <p className="font-medium tabular-nums">{instructor.rating}</p>
                <p className="mt-0.5 text-muted">Rating</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default InstructorHighlights;
