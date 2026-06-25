"use client";

import {
  ClipboardEvent,
  FC,
  KeyboardEvent,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OtpInput: FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  error = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return;

    const chars = value.split("");
    while (chars.length < OTP_LENGTH) chars.push("");
    chars[index] = char;
    onChange(chars.join("").slice(0, OTP_LENGTH));

    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit.trim()}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-11 w-10 rounded-[10px] border bg-card text-center text-lg font-semibold tabular-nums text-foreground outline-none transition-all duration-200 sm:h-12 sm:w-11",
            error
              ? "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              : "border-border focus:border-accent/40 focus:ring-2 focus:ring-ring",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
