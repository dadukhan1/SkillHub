import { FC } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/user";

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

const imageSizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
};

const UserAvatar: FC<UserAvatarProps> = ({
  name,
  src,
  size = "md",
  className,
}) => {
  const initials = getInitials(name);

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={imageSizeMap[size]}
        height={imageSizeMap[size]}
        className={cn(
          "shrink-0 rounded-full object-cover ring-1 ring-border",
          sizeMap[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-surface font-medium text-muted ring-1 ring-border",
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
