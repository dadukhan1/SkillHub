"use client";

import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRegisterMutation } from "@/redux/features/apiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SocialAuthButtons from "./SocialAuthButtons";

const PENDING_REGISTRATION_KEY = "skillhub_pending_registration";

export const storePendingRegistration = (data: {
  name: string;
  email: string;
  password: string;
  activationToken: string;
}) => {
  sessionStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(data));
};

export const getPendingRegistration = () => {
  const raw = sessionStorage.getItem(PENDING_REGISTRATION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as {
      name: string;
      email: string;
      password: string;
      activationToken: string;
    };
  } catch {
    return null;
  }
};

export const clearPendingRegistration = () => {
  sessionStorage.removeItem(PENDING_REGISTRATION_KEY);
};

const SignUpForm: FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await register({ name, email, password }).unwrap();
      storePendingRegistration({
        name,
        email,
        password,
        activationToken: result.activationToken,
      });
      toast.success("Check your email for the verification code.");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create account."));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-center lg:text-left">
        <h1 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          Create your account
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Start learning free — no credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <Input
          label="Full name"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-2"
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-2"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-2"
          minLength={8}
          required
        />

        <label className="flex cursor-pointer items-start gap-2 pt-0.5">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-border accent-accent"
          />
          <span className="text-[12px] leading-snug text-muted">
            I agree to the{" "}
            <Link href="#" className="text-foreground underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-foreground underline underline-offset-2">
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button type="submit" size="md" className="mt-1 w-full" disabled={isLoading}>
          {isLoading ? "Sending code…" : "Create account"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-background px-2 text-muted">or continue with</span>
        </div>
      </div>

      <SocialAuthButtons />

      <p className="mt-4 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-accent transition-colors hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
