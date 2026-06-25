import type { Metadata } from "next";
import SignUpForm from "@/app/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — SkillHub",
  description: "Create your free SkillHub account and start learning today.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
