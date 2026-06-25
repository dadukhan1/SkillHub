import { FC } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import HeroPreview from "./HeroPreview";
import Button from "../ui/Button";

const trustedBy = ["Vercel", "Stripe", "Notion", "Linear", "Figma"];

const Hero: FC = () => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="text-center lg:text-left">
            <p className="label animate-fade-up mb-6">Premium learning platform</p>

            <h1 className="animate-fade-up-delay-1 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.25rem]">
              Learn with clarity.
              <br />
              <span className="text-muted">Grow with purpose.</span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-[28rem] text-[17px] leading-[1.65] text-muted lg:mx-0">
              Expert-led courses and structured paths for professionals who
              value depth over noise. Built for focus, designed for real growth.
            </p>

            <div className="animate-fade-up-delay-2 mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup">
                <Button size="lg">Start learning free</Button>
              </Link>
              <Link href="#courses">
                <Button variant="secondary" size="lg">Browse courses</Button>
              </Link>
            </div>

            <div className="animate-fade-up-delay-3 mx-auto mt-10 max-w-md lg:mx-0 lg:max-w-none">
              <SearchBar size="large" />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-muted lg:justify-start">
                <span>Popular</span>
                {["React", "Product Design", "TypeScript", "AI"].map((term, i) => (
                  <span key={term} className="flex items-center gap-3">
                    {i > 0 && <span className="text-border">·</span>}
                    <Link
                      href={`#courses?q=${term.toLowerCase()}`}
                      className="transition-colors duration-200 hover:text-foreground"
                    >
                      {term}
                    </Link>
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up-delay-3 mt-14 grid grid-cols-3 gap-8 border-t border-border pt-10 lg:max-w-sm">
              {[
                { value: "200+", label: "Courses" },
                { value: "4.9", label: "Avg. rating" },
                { value: "50k+", label: "Learners" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold tracking-[-0.02em]">{stat.value}</p>
                  <p className="mt-1 text-[13px] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up-delay-2 hidden lg:block">
            <HeroPreview />
          </div>
        </div>

        <div className="animate-fade-up-delay-3 mt-16 lg:hidden">
          <HeroPreview />
        </div>

        <div className="animate-fade-up-delay-3 mt-20 border-t border-border pt-12">
          <p className="label mb-8 text-center lg:text-left">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 lg:justify-start">
            {trustedBy.map((company) => (
              <span
                key={company}
                className="text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:text-muted"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
