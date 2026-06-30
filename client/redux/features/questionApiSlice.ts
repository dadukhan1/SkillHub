/** @format */

import type {
  AddAnswerResponse,
  AddQuestionResponse,
  CourseQuestion,
  CourseQuestionReply,
} from "../types/course";
import type { RootState } from "../store";
import { courseApiSlice as apiSlice } from "./courseApiSlice";

type AddQuestionArgs = {
  courseId: string;
  contentId: string;
  question: string;
};

type AddAnswerArgs = {
  courseId: string;
  contentId: string;
  questionId: string;
  answer: string;
};

export const questionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addQuestion: builder.mutation<AddQuestionResponse, AddQuestionArgs>({
      query: ({ courseId, contentId, question }) => ({
        url: "/add-question",
        method: "PUT",
        body: { courseId, contentId, question },
      }),
      async onQueryStarted(
        { courseId, contentId, question },
        { dispatch, queryFulfilled, getState },
      ) {
        const user = (getState() as RootState).auth.user;
        const tempId = `optimistic-${Date.now()}`;
        const optimisticQuestion: CourseQuestion = {
          _id: tempId,
          user: {
            name: user?.name ?? "You",
            email: user?.email ?? "",
          },
          question,
          questionReplies: [],
        };

        const patch = dispatch(
          apiSlice.util.updateQueryData("getCourseContent", courseId, (draft) => {
            const lesson = draft.content.find((item) => item._id === contentId);
            if (lesson) {
              lesson.questions = lesson.questions ?? [];
              lesson.questions.push(optimisticQuestion);
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getCourseContent",
              courseId,
              (draft) => {
                const lesson = draft.content.find(
                  (item) => item._id === contentId,
                );
                if (!lesson?.questions) return;

                const index = lesson.questions.findIndex(
                  (item) => item._id === tempId,
                );
                if (index >= 0) {
                  lesson.questions[index] = data.question;
                } else {
                  lesson.questions.push(data.question);
                }
              },
            ),
          );
        } catch {
          patch.undo();
        }
      },
    }),
    addAnswer: builder.mutation<AddAnswerResponse, AddAnswerArgs>({
      query: ({ courseId, contentId, questionId, answer }) => ({
        url: "/add-answer",
        method: "PUT",
        body: { courseId, contentId, questionId, answer },
      }),
      async onQueryStarted(
        { courseId, contentId, questionId, answer },
        { dispatch, queryFulfilled, getState },
      ) {
        const user = (getState() as RootState).auth.user;
        const tempId = `optimistic-${Date.now()}`;
        const optimisticAnswer: CourseQuestionReply = {
          _id: tempId,
          user: {
            name: user?.name ?? "Admin",
            email: user?.email ?? "",
          },
          answer,
        };

        const patch = dispatch(
          apiSlice.util.updateQueryData("getCourseContent", courseId, (draft) => {
            const lesson = draft.content.find((item) => item._id === contentId);
            const question = lesson?.questions?.find(
              (item) => item._id === questionId,
            );
            if (question) {
              question.questionReplies = question.questionReplies ?? [];
              question.questionReplies.push(optimisticAnswer);
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              "getCourseContent",
              courseId,
              (draft) => {
                const lesson = draft.content.find(
                  (item) => item._id === contentId,
                );
                const question = lesson?.questions?.find(
                  (item) => item._id === questionId,
                );
                if (!question?.questionReplies) return;

                const index = question.questionReplies.findIndex(
                  (item) => item._id === tempId,
                );
                if (index >= 0) {
                  question.questionReplies[index] = data.answer;
                } else {
                  question.questionReplies.push(data.answer);
                }
              },
            ),
          );
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const { useAddQuestionMutation, useAddAnswerMutation } =
  questionApiSlice;
