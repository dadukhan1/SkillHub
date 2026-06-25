import { FC } from "react";
import { analyticsStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const AnalyticsWidget: FC = () => (
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {analyticsStats.map((stat) => (
      <div
        key={stat.label}
        className="rounded-[14px] border border-border bg-card p-5"
      >
        <p className="text-[13px] text-muted">{stat.label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] tabular-nums">
          {stat.value}
        </p>
        <p
          className={cn(
            "mt-1 text-[11px]",
            stat.trend === "up" && "text-muted",
            stat.trend === "neutral" && "text-muted-foreground"
          )}
        >
          {stat.change}
        </p>
      </div>
    ))}
  </div>
);

export default AnalyticsWidget;
