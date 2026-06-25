import { FC, ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

interface AuthShellProps {
  children: ReactNode;
}

const AuthShell: FC<AuthShellProps> = ({ children }) => (
  <div className="flex h-dvh max-h-dvh overflow-hidden">
    <div className="relative hidden h-full w-1/2 shrink-0 flex-col justify-between overflow-hidden border-r border-border bg-surface p-10 xl:p-12 lg:flex">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <Link
        href="/"
        className="relative shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
      >
        SkillHub
      </Link>

      <div className="relative max-w-md">
        <p className="label mb-3">Premium learning platform</p>
        <h2 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] xl:text-3xl">
          Learn with clarity.
          <br />
          <span className="text-muted">Grow with purpose.</span>
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          Join thousands of professionals building skills across development,
          design, business, and more.
        </p>
      </div>

      <div className="relative grid shrink-0 grid-cols-3 gap-4 border-t border-border pt-6">
        {[
          { value: "200+", label: "Courses" },
          { value: "4.9", label: "Avg. rating" },
          { value: "50k+", label: "Learners" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-base font-semibold tracking-[-0.02em]">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70 lg:hidden"
        >
          SkillHub
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-[13px] text-muted transition-colors hover:text-foreground sm:block"
          >
            Back to home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-6">
        <div className="mx-auto w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  </div>
);

export default AuthShell;
