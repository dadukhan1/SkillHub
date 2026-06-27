import { FC } from "react";
import { cn } from "@/lib/utils";

export interface AdminStat {
  value: string;
  label: string;
}

interface AdminStatsProps {
  stats: AdminStat[];
  className?: string;
}

const AdminStats: FC<AdminStatsProps> = ({ stats, className }) => (
  <div
    className={cn(
      "animate-fade-up-delay-1 grid gap-6 border-b border-border py-8 sm:grid-cols-2 lg:grid-cols-4",
      className,
    )}
  >
    {stats.map((stat) => (
      <div key={stat.label}>
        <p className="text-xl font-semibold tracking-[-0.02em] tabular-nums">
          {stat.value}
        </p>
        <p className="mt-1 text-[13px] text-muted">{stat.label}</p>
      </div>
    ))}
  </div>
);

export default AdminStats;
