import { FC } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

const SectionHeader: FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  className,
  align = "left",
}) => (
  <div
    className={cn(
      "max-w-xl",
      align === "center" && "mx-auto text-center",
      className
    )}
  >
    {label && <p className="label mb-4">{label}</p>}
    <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-[2rem] sm:leading-tight">
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-[15px] leading-relaxed text-muted">{description}</p>
    )}
  </div>
);

export default SectionHeader;
