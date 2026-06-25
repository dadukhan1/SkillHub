import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline";
}

const Badge: FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
      variant === "default" && "bg-surface text-muted",
      variant === "accent" && "bg-accent-muted text-accent",
      variant === "outline" && "border border-border text-muted",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
