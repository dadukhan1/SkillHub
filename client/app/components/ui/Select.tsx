import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label htmlFor={selectId} className="text-[13px] font-medium text-foreground">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full rounded-[12px] border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-all duration-200 focus:border-accent/40 focus:ring-2 focus:ring-ring",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
