import type { Metadata } from "next";
import SignInForm from "@/app/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in — SkillHub",
  description: "Sign in to your SkillHub account and continue learning.",
};

export default function SignInPage() {
  return <SignInForm />;
}
