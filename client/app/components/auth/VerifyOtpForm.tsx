"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "../ui/Button";
import OtpInput from "./OtpInput";

const RESEND_SECONDS = 60;

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
};

const VerifyOtpForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock verification — replace with API call
    if (otp === "000000") {
      setError("Invalid code. Please try again.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setResendTimer(RESEND_SECONDS);
    setOtp("");
    setIsResending(false);
  };

  if (!email) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          Missing email
        </h1>
        <p className="mt-2 text-[14px] text-muted">
          Start from sign up to receive a verification code.
        </p>
        <Link href="/signup" className="mt-5 inline-block">
          <Button size="md">Go to sign up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-5 text-center lg:text-left">
        <h1 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          Verify your email
        </h1>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{maskEmail(email)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            disabled={isLoading}
            error={!!error}
          />
          {error && (
            <p className="text-center text-[12px] text-red-500">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          size="md"
          className="w-full"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying…" : "Verify & continue"}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-muted">
        Didn&apos;t receive a code?{" "}
        {resendTimer > 0 ? (
          <span className="tabular-nums">Resend in {resendTimer}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium text-accent transition-colors hover:text-accent-hover disabled:opacity-50"
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-[13px] text-muted">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Go back
        </Link>
      </p>
    </div>
  );
};

export default VerifyOtpForm;
