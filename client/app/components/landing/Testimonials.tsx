import { FC } from "react";
import { testimonials } from "@/lib/mock-data";
import Avatar from "../ui/Avatar";
import SectionHeader from "../ui/SectionHeader";

const Testimonials: FC = () => (
  <section className="border-y border-border bg-surface py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeader
        label="Testimonials"
        title="Loved by learners"
        description="Hear from professionals who've transformed their careers with SkillHub."
        align="center"
        className="mb-14"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote
            key={item.id}
            className="flex flex-col rounded-[16px] border border-border bg-card p-6"
          >
            <p className="flex-1 text-[15px] leading-[1.65] text-foreground/90">
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <Avatar initials={item.avatar} size="md" />
              <div>
                <p className="text-[13px] font-medium">{item.author}</p>
                <p className="text-[12px] text-muted">{item.role}</p>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
