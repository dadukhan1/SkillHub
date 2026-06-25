import { FC } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

const Avatar: FC<AvatarProps> = ({ initials, size = "md", className }) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-full bg-surface font-medium text-muted ring-1 ring-border",
      sizeMap[size],
      className
    )}
  >
    {initials}
  </div>
);

export default Avatar;
