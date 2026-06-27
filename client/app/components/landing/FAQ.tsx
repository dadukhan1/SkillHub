"use client";

import { FC, useState } from "react";
import { useGetLayoutByTypeQuery } from "@/redux/features/layoutApiSlice";

const INITIAL_VISIBLE = 8;

const FAQ: FC = () => {
  const { data, isLoading } = useGetLayoutByTypeQuery("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = data?.layout?.faq || [];

  if (isLoading || questions.length === 0) {
    return null;
  }

  const visibleQuestions = showAll ? questions : questions.slice(0, INITIAL_VISIBLE);
  const hasMore = questions.length > INITIAL_VISIBLE;

  return (
    <section className="relative mt-20 border-t border-border pt-24 pb-20 sm:mt-28 sm:pt-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Section header — full width, centered */}
        <div className="mx-auto mb-14 max-w-2xl text-center animate-fade-up">
          <p className="label mb-5">Got questions?</p>
          <h2 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[2.75rem]">
            Frequently Asked{" "}
            <span className="text-muted">Questions.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-[17px] leading-[1.65] text-muted">
            Find answers to the most common questions about our platform, pricing, and how to get started.
          </p>
        </div>

        {/* Accordion list */}
        <div className="animate-fade-up-delay-1 space-y-3">
          {visibleQuestions.map((q, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-[14px] border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors duration-200 hover:bg-border/20 sm:px-6 sm:py-5"
                >
                  <span className="text-[16px] font-medium leading-snug text-foreground">
                    {q.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 ${
                      isOpen ? "rotate-180 border-foreground/20 text-foreground" : ""
                    }`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-border px-5 pb-5 pt-4 text-[15px] leading-relaxed text-muted sm:px-6 sm:pb-6">
                      {q.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more / less */}
        {hasMore && (
          <div className="mt-8 text-center animate-fade-up-delay-2">
            <button
              onClick={() => {
                setShowAll((v) => !v);
                if (showAll) setOpenIndex(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13px] font-medium text-muted transition-all duration-200 hover:border-foreground/20 hover:text-foreground"
            >
              {showAll ? (
                <>Show less</>
              ) : (
                <>
                  Show {questions.length - INITIAL_VISIBLE} more question
                  {questions.length - INITIAL_VISIBLE !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default FAQ;
