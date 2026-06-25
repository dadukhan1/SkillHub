import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyOtpForm from "@/app/components/auth/VerifyOtpForm";

export const metadata: Metadata = {
  title: "Verify email — SkillHub",
  description: "Enter the verification code sent to your email.",
};

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-[14px] text-muted">Loading…</p>
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
