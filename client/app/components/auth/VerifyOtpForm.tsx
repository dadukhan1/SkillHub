"use client";

import { FC, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useActivateMutation, useRegisterMutation } from "@/redux/features/apiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import Button from "../ui/Button";
import OtpInput from "./OtpInput";
import {
  clearPendingRegistration,
  getPendingRegistration,
  storePendingRegistration,
} from "./SignUpForm";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 4;

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(local.length - 1, 2))}@${domain}`;
};

const VerifyOtpForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [activate, { isLoading }] = useActivateMutation();
  const [register, { isLoading: isResending }] = useRegisterMutation();

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

    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
      return;
    }

    const pending = getPendingRegistration();
    if (!pending?.activationToken) {
      setError("Session expired. Please sign up again.");
      return;
    }

    try {
      await activate({
        activationToken: pending.activationToken,
        activationCode: otp,
      }).unwrap();
      clearPendingRegistration();
      toast.success("Account activated! You can sign in now.");
      router.push("/signin");
    } catch (err) {
      const message = getErrorMessage(err, "Invalid code. Please try again.");
      setError(message);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;

    const pending = getPendingRegistration();
    if (!pending) {
      toast.error("Session expired. Please sign up again.");
      router.push("/signup");
      return;
    }

    try {
      const result = await register({
        name: pending.name,
        email: pending.email,
        password: pending.password,
      }).unwrap();
      storePendingRegistration({
        ...pending,
        activationToken: result.activationToken,
      });
      setResendTimer(RESEND_SECONDS);
      setOtp("");
      toast.success("A new code has been sent to your email.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to resend code."));
    }
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
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className="font-medium text-foreground">{maskEmail(email)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <OtpInput
            length={OTP_LENGTH}
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
          disabled={isLoading || otp.length !== OTP_LENGTH}
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
