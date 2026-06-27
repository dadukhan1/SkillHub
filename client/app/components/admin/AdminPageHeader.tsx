"use client";

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  label: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  label,
  title,
  description,
  actions,
  className,
}) => (
  <div
    className={cn(
      "animate-fade-up flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between",
      className,
    )}
  >
    <div className="max-w-2xl">
      <p className="label mb-4">{label}</p>
      <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[2.25rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-muted">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export default AdminPageHeader;
