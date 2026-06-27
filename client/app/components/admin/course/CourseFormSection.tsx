import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CourseFormSectionProps {
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const CourseFormSection: FC<CourseFormSectionProps> = ({
  label,
  title,
  description,
  children,
  className,
}) => (
  <section
    className={cn(
      "rounded-[16px] border border-border bg-card p-6 shadow-soft",
      className,
    )}
  >
    <p className="label mb-3">{label}</p>
    <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
      {title}
    </h2>
    {description && (
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{description}</p>
    )}
    <div className="mt-6 space-y-5">{children}</div>
  </section>
);

export default CourseFormSection;
