"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const courseId = params?.id ?? "";

  // Webhook already handled the order — just redirect to the course after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/courses/${courseId}/learn`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [courseId, router]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-6 px-6">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold">Payment Successful!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re all set. Redirecting you to your course...
        </p>
      </div>

      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />

      <Link
        href={`/courses/${courseId}/learn`}
        className="text-sm underline underline-offset-4"
      >
        Go to course now
      </Link>
    </div>
  );
}
