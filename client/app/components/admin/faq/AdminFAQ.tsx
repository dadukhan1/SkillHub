"use client";

import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import {
  useGetLayoutByTypeQuery,
  useEditLayoutMutation,
} from "@/redux/features/layoutApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { FaqItem } from "@/redux/types/layout";

const AdminFAQ: FC = () => {
  const { data, isLoading, isError, refetch } = useGetLayoutByTypeQuery("FAQ");
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();
  const [questions, setQuestions] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleQuestionChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === id ? { ...q, question: value } : q)),
    );
  };

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === id ? { ...q, answer: value } : q)),
    );
  };

  const newFaqHandler = () => {
    setQuestions((prev) => [...prev, { question: "", answer: "" }]);
    // open the new item
    setOpenIndex(questions.length);
    // scroll to bottom after render
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const removeFaqHandler = (id: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== id));
    if (openIndex === id) setOpenIndex(null);
    else if (openIndex !== null && openIndex > id) setOpenIndex(openIndex - 1);
  };

  const moveUp = (id: number) => {
    if (id === 0) return;
    setQuestions((prev) => {
      const next = [...prev];
      [next[id - 1], next[id]] = [next[id], next[id - 1]];
      return next;
    });
    if (openIndex === id) setOpenIndex(id - 1);
    else if (openIndex === id - 1) setOpenIndex(id);
  };

  const moveDown = (id: number) => {
    if (id === questions.length - 1) return;
    setQuestions((prev) => {
      const next = [...prev];
      [next[id], next[id + 1]] = [next[id + 1], next[id]];
      return next;
    });
    if (openIndex === id) setOpenIndex(id + 1);
    else if (openIndex === id + 1) setOpenIndex(id);
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one FAQ before saving.");
      return;
    }
    const emptyField = questions.find((q) => !q.question.trim() || !q.answer.trim());
    if (emptyField) {
      toast.error("Please fill in both question and answer for all items.");
      return;
    }
    try {
      const payload: FaqItem[] = questions.map(({ question, answer }) => ({
        question: question.trim(),
        answer: answer.trim(),
      }));
      await editLayout({ type: "FAQ", faq: payload }).unwrap();
      toast.success("FAQs saved successfully!");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save FAQs. Please try again."));
    }
  };

  if (isLoading) return <AdminLoadingState />;

  if (isError) {
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">Failed to load FAQ data.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-32">
      {/* Sticky header bar */}
      <div className="sticky top-0 z-20 -mx-4 mb-8 flex items-center justify-between border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div>
          <p className="label text-[11px]">FAQ Management</p>
          <p className="mt-0.5 text-[15px] font-semibold text-foreground">
            Manage FAQs
            {questions.length > 0 && (
              <span className="ml-2 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-normal text-muted">
                {questions.length} item{questions.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isEditing}>
          {isEditing ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="rounded-[14px] border border-border bg-card px-6 py-16 text-center">
          <p className="text-[14px] text-muted">
            No FAQs yet. Click &quot;Add new question&quot; below to get started.
          </p>
        </div>
      )}

      {/* FAQ list */}
      <div className="space-y-3">
        {questions.map((q, i) => {
          const isOpen = openIndex === i;
          const isFirst = i === 0;
          const isLast = i === questions.length - 1;

          return (
            <div
              key={i}
              className="rounded-[14px] border border-border bg-card overflow-hidden transition-shadow duration-200 hover:shadow-sm"
            >
              {/* Row header */}
              <div className="flex min-h-[56px] items-center gap-3 px-4 sm:px-5">
                {/* Index badge */}
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-medium text-muted">
                  {i + 1}
                </span>

                {/* Question preview — click to expand */}
                <button
                  onClick={() => toggleAccordion(i)}
                  className="flex-1 min-w-0 py-4 text-left"
                >
                  <span className="block truncate text-[14px] font-medium text-foreground">
                    {q.question.trim() || <span className="text-muted-foreground">New question…</span>}
                  </span>
                  {!isOpen && q.answer.trim() && (
                    <span className="block truncate text-[12px] text-muted mt-0.5">
                      {q.answer.trim()}
                    </span>
                  )}
                </button>

                {/* Controls */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  {/* Reorder up */}
                  <button
                    onClick={() => moveUp(i)}
                    disabled={isFirst}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-border/50 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
                    </svg>
                  </button>
                  {/* Reorder down */}
                  <button
                    onClick={() => moveDown(i)}
                    disabled={isLast}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-border/50 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 10L2 4H10L6 10Z" fill="currentColor" />
                    </svg>
                  </button>

                  {/* Expand / Collapse */}
                  <button
                    onClick={() => toggleAccordion(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-border/50 hover:text-foreground"
                    title={isOpen ? "Collapse" : "Expand"}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 15 15"
                      fill="none"
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeFaqHandler(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                    title="Remove"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M1 1L11 11M11 1L1 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expandable edit form */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100 border-t border-border"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 p-4 sm:p-5">
                    <Input
                      label="Question"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(i, e.target.value)}
                      placeholder="e.g., What is SkillHub?"
                    />
                    <Textarea
                      label="Answer"
                      value={q.answer}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      placeholder="Provide a detailed answer..."
                      className="min-h-[90px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button — always visible at bottom */}
      <div className="mt-6">
        <Button variant="secondary" onClick={newFaqHandler} className="w-full">
          + Add new question
        </Button>
      </div>
    </div>
  );
};

export default AdminFAQ;
