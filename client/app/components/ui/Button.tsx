import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-foreground text-background hover:opacity-90",
  secondary:
    "bg-card border border-border text-foreground hover:bg-card-hover",
  ghost: "text-muted hover:text-foreground hover:bg-foreground/[0.04]",
};

const sizes = {
  sm: "h-8 px-3.5 text-[13px] rounded-[10px]",
  md: "h-10 px-4 text-sm rounded-[12px]",
  lg: "h-11 px-5 text-sm rounded-[12px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export default Button;
