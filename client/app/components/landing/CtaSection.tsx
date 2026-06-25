import { FC } from "react";
import Link from "next/link";
import Button from "../ui/Button";

const CtaSection: FC = () => (
  <section id="get-started" className="py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="rounded-[20px] border border-border bg-surface px-8 py-16 text-center sm:px-16 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-[2rem]">
          Start learning today
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Join thousands of professionals building skills that matter.
          Free to start — no credit card required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <Button size="lg">Get started free</Button>
          </Link>
          <Link href="#courses">
            <Button variant="secondary" size="lg">Browse courses</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
