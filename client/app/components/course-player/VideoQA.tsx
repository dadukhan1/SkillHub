/** @format */

import React, { FC, KeyboardEvent, useState } from "react";
import Button from "@/app/components/ui/Button";
import { useAuth } from "@/redux/hooks";
import type { CourseQuestion } from "@/redux/types/course";
import {
  useAddQuestionMutation,
  useAddAnswerMutation,
} from "@/redux/features/questionApiSlice";
import toast from "react-hot-toast";

interface VideoQAProps {
  courseId: string;
  contentId: string;
  questions: CourseQuestion[];
}

const textareaClassName =
  "w-full resize-none rounded-[10px] border border-border bg-background p-3.5 text-[14px] leading-relaxed text-foreground placeholder:text-muted transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const Spinner = () => (
  <span
    aria-hidden='true'
    className='inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent'
  />
);

const VideoQA: FC<VideoQAProps> = ({ courseId, contentId, questions }) => {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  const [addQuestion, { isLoading: isPostingQuestion }] =
    useAddQuestionMutation();
  const [addAnswer] = useAddAnswerMutation();
  const [postingAnswerFor, setPostingAnswerFor] = useState<string | null>(
    null,
  );

  const handleAskQuestion = async () => {
    const trimmed = newQuestion.trim();
    if (!trimmed) {
      toast.error("Please enter a question");
      return;
    }

    if (!user) {
      toast.error("Please sign in to ask questions");
      return;
    }

    try {
      await addQuestion({
        courseId,
        contentId,
        question: trimmed,
      }).unwrap();

      setNewQuestion("");
      toast.success("Question posted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add question");
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = newAnswers[questionId]?.trim();
    if (!answer) {
      toast.error("Please enter an answer");
      return;
    }

    setPostingAnswerFor(questionId);

    try {
      await addAnswer({
        courseId,
        contentId,
        questionId,
        answer,
      }).unwrap();

      setNewAnswers((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
      setExpandedQuestions((prev) => ({ ...prev, [questionId]: true }));
      toast.success("Answer posted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add answer");
    } finally {
      setPostingAnswerFor(null);
    }
  };

  const handleQuestionKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleAskQuestion();
    }
  };

  const handleAnswerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
    questionId: string,
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleAnswerQuestion(questionId);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className='mt-8 border-t border-border pt-8'>
      <div className='mb-6 flex items-end justify-between gap-4'>
        <div>
          <h3 className='text-[1.25rem] font-semibold tracking-[-0.02em] text-foreground'>
            Questions & Answers
          </h3>
          <p className='mt-1 text-[13px] text-muted'>
            Ask about this lesson or read replies from the instructor.
          </p>
        </div>
        {questions.length > 0 && (
          <span className='shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-[12px] font-medium text-muted'>
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {user ? (
        <div className='mb-6 rounded-[12px] border border-border bg-card/50 p-5'>
          <label
            htmlFor='video-question'
            className='text-[15px] font-medium text-foreground'
          >
            Ask a question
          </label>
          <textarea
            id='video-question'
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={handleQuestionKeyDown}
            placeholder='What would you like to know about this video?'
            className={`${textareaClassName} mt-3`}
            rows={3}
            disabled={isPostingQuestion}
          />
          <div className='mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-[12px] text-muted'>Press Ctrl+Enter to post</p>
            <Button
              type='button'
              size='sm'
              onClick={() => void handleAskQuestion()}
              disabled={!newQuestion.trim() || isPostingQuestion}
              className='w-full sm:w-auto'
            >
              {isPostingQuestion ? (
                <>
                  <Spinner />
                  Posting...
                </>
              ) : (
                "Post question"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <p className='mb-6 rounded-[12px] border border-dashed border-border bg-card/30 px-4 py-3 text-[13px] text-muted'>
          Sign in to ask questions about this video.
        </p>
      )}

      <div className='space-y-3'>
        {questions.length > 0 ? (
          questions.map((question) => {
            const replyCount = question.questionReplies?.length ?? 0;
            const isExpanded = expandedQuestions[question._id];
            const isAnsweringThis = postingAnswerFor === question._id;
            const answerDraft = newAnswers[question._id] ?? "";

            return (
              <div
                key={question._id}
                className='overflow-hidden rounded-[12px] border border-border bg-card/30'
              >
                <button
                  type='button'
                  onClick={() => toggleQuestion(question._id)}
                  className='flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-card/60'
                >
                  <div className='min-w-0 flex-1'>
                    <p className='text-[15px] font-medium leading-snug text-foreground'>
                      {question.question}
                    </p>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-[12px] text-muted'>
                      <span>{question.user?.name}</span>
                      {replyCount > 0 && (
                        <span className='rounded-full bg-muted/60 px-2 py-0.5 font-medium text-muted-foreground'>
                          {replyCount} repl{replyCount === 1 ? "y" : "ies"}
                        </span>
                      )}
                    </div>
                  </div>
                  <svg
                    className={`mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 9l-7 7-7-7'
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div className='space-y-4 border-t border-border px-4 py-4'>
                    {replyCount > 0 ? (
                      <div className='space-y-3'>
                        {question.questionReplies?.map((answer) => (
                          <div
                            key={answer._id}
                            className='rounded-[10px] border border-border/70 bg-background/80 p-3.5'
                          >
                            <p className='text-[14px] leading-relaxed text-foreground/90'>
                              {answer.answer}
                            </p>
                            <p className='mt-2 text-[12px] text-muted'>
                              <span className='font-medium text-foreground/80'>
                                {answer.user?.name}
                              </span>
                              <span className='mx-1.5 text-border'>·</span>
                              Instructor
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !isAdmin && (
                        <p className='text-[13px] text-muted'>
                          No answer yet. The instructor will reply soon.
                        </p>
                      )
                    )}

                    {isAdmin && (
                      <div className='rounded-[10px] border border-border bg-card/50 p-4'>
                        <label
                          htmlFor={`answer-${question._id}`}
                          className='text-[14px] font-medium text-foreground'
                        >
                          Write a reply
                        </label>
                        <textarea
                          id={`answer-${question._id}`}
                          value={answerDraft}
                          onChange={(e) =>
                            setNewAnswers((prev) => ({
                              ...prev,
                              [question._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            handleAnswerKeyDown(e, question._id)
                          }
                          placeholder='Share a clear, helpful answer...'
                          className={`${textareaClassName} mt-3`}
                          rows={3}
                          disabled={isAnsweringThis}
                        />
                        <div className='mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
                          <p className='text-[12px] text-muted'>
                            Press Ctrl+Enter to reply
                          </p>
                          <Button
                            type='button'
                            size='sm'
                            onClick={() => void handleAnswerQuestion(question._id)}
                            disabled={!answerDraft.trim() || isAnsweringThis}
                            className='w-full sm:w-auto'
                          >
                            {isAnsweringThis ? (
                              <>
                                <Spinner />
                                Posting...
                              </>
                            ) : (
                              "Post answer"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className='rounded-[12px] border border-dashed border-border px-6 py-10 text-center'>
            <p className='text-[14px] text-muted'>
              No questions yet. Be the first to ask.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoQA;
