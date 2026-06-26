"use client";

import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/features/apiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SocialAuthButtons from "./SocialAuthButtons";

const SignInForm: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password }).unwrap();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid email or password."));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-5 text-center lg:text-left">
        <h1 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Sign in to continue your learning journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-2"
          required
        />

        <div className="-mt-1 flex justify-end">
          <Link
            href="#"
            className="text-[12px] text-muted transition-colors hover:text-accent"
          >
            Forgot password?
          </Link>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            defaultChecked
            className="h-3.5 w-3.5 rounded border-border accent-accent"
          />
          <span className="text-[12px] text-muted">Remember me for 30 days</span>
        </label>

        <Button type="submit" size="md" className="mt-1 w-full" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-background px-2 text-muted">or continue with</span>
        </div>
      </div>

      <SocialAuthButtons />

      <p className="mt-5 text-center text-[13px] text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-accent transition-colors hover:text-accent-hover">
          Sign up free
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
