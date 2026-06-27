"use client";

import { FC, FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CourseFormSection from "@/app/components/admin/course/CourseFormSection";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Textarea from "@/app/components/ui/Textarea";
import { fileToBase64 } from "@/lib/files";
import {
  COURSE_LEVELS,
  VIDEO_PLAYERS,
  createEmptyLesson,
  formValuesToPayload,
  type CourseFormValues,
  validateCourseForm,
} from "@/lib/course-form";
import {
  useCreateCourseMutation,
  useEditCourseMutation,
} from "@/redux/features/courseApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  mode: "create" | "edit";
  courseId?: string;
  initialValues: CourseFormValues;
}

const CourseForm: FC<CourseFormProps> = ({ mode, courseId, initialValues }) => {
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState(initialValues);

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [editCourse, { isLoading: isEditing }] = useEditCourseMutation();

  const isSubmitting = isCreating || isEditing;

  const updateField = <K extends keyof CourseFormValues>(
    key: K,
    value: CourseFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateListItem = (
    field: "benefits" | "preRequisites",
    index: number,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const addListItem = (field: "benefits" | "preRequisites") => {
    setValues((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  };

  const removeListItem = (
    field: "benefits" | "preRequisites",
    index: number,
  ) => {
    setValues((current) => ({
      ...current,
      [field]:
        current[field].length === 1
          ? [""]
          : current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateLesson = (
    index: number,
    key: keyof CourseFormValues["courseData"][number],
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      courseData: current.courseData.map((lesson, lessonIndex) =>
        lessonIndex === index ? { ...lesson, [key]: value } : lesson,
      ),
    }));
  };

  const addLesson = () => {
    setValues((current) => ({
      ...current,
      courseData: [...current.courseData, createEmptyLesson()],
    }));
  };

  const removeLesson = (index: number) => {
    setValues((current) => ({
      ...current,
      courseData:
        current.courseData.length === 1
          ? [createEmptyLesson()]
          : current.courseData.filter((_, lessonIndex) => lessonIndex !== index),
    }));
  };

  const handleThumbnailChange = async (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be smaller than 4 MB.");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      updateField("thumbnailBase64", base64);
      updateField("thumbnailPreview", base64);
    } catch {
      toast.error("Unable to read the selected image.");
    } finally {
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationError = validateCourseForm(values, mode);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = formValuesToPayload(values);

    try {
      if (mode === "create") {
        await createCourse(payload).unwrap();
        toast.success("Course created successfully.");
      } else if (courseId) {
        await editCourse({ id: courseId, body: payload }).unwrap();
        toast.success("Course updated successfully.");
      }

      router.push("/dashboard/courses");
      router.refresh();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          mode === "create" ? "Failed to create course." : "Failed to update course.",
        ),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <CourseFormSection
        label="Basics"
        title="Course details"
        description="Set the foundation — name, description, and how learners will discover this course."
      >
        <Input
          label="Course name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Advanced React Patterns"
          required
        />
        <Textarea
          label="Description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="What will learners gain from this course?"
          required
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Tags"
            value={values.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            placeholder="React, Frontend, JavaScript"
            required
          />
          <Select
            label="Level"
            value={values.level}
            onChange={(event) => updateField("level", event.target.value)}
            options={COURSE_LEVELS.map((level) => ({ value: level, label: level }))}
          />
        </div>
      </CourseFormSection>

      <CourseFormSection
        label="Pricing"
        title="Price & preview"
        description="Define how the course is priced and where learners can preview content."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Price (USD)"
            type="number"
            min="0"
            step="1"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
            placeholder="89"
            required
          />
          <Input
            label="Estimated price (optional)"
            type="number"
            min="0"
            step="1"
            value={values.estimatedPrice}
            onChange={(event) => updateField("estimatedPrice", event.target.value)}
            placeholder="129"
          />
        </div>
        <Input
          label="Demo URL"
          type="url"
          value={values.demoUrl}
          onChange={(event) => updateField("demoUrl", event.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </CourseFormSection>

      <CourseFormSection
        label="Media"
        title="Course thumbnail"
        description="Upload a cover image that represents the course across the platform."
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div
            className={cn(
              "relative flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-border bg-surface sm:w-64",
              values.thumbnailPreview && "border-solid",
            )}
          >
            {values.thumbnailPreview ? (
              values.thumbnailPreview.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.thumbnailPreview}
                  alt="Course thumbnail preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={values.thumbnailPreview}
                  alt="Course thumbnail preview"
                  fill
                  className="object-cover"
                  sizes="256px"
                />
              )
            ) : (
              <p className="px-4 text-center text-[13px] text-muted">
                No thumbnail selected
              </p>
            )}
          </div>

          <div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              {values.thumbnailPreview ? "Change thumbnail" : "Upload thumbnail"}
            </Button>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleThumbnailChange(event.target.files?.[0])}
            />
            <p className="mt-3 text-[12px] text-muted">
              JPG, PNG or WebP. Max 4 MB.
              {mode === "create" ? " Required for new courses." : " Leave unchanged to keep the current image."}
            </p>
          </div>
        </div>
      </CourseFormSection>

      <CourseFormSection
        label="Outcomes"
        title="What you'll learn"
        description="List the key benefits learners will take away from this course."
      >
        <ListFieldGroup
          items={values.benefits}
          placeholder="Build production-ready React applications"
          onChange={(index, value) => updateListItem("benefits", index, value)}
          onAdd={() => addListItem("benefits")}
          onRemove={(index) => removeListItem("benefits", index)}
        />
      </CourseFormSection>

      <CourseFormSection
        label="Requirements"
        title="Prerequisites"
        description="Help learners understand what they should know before starting."
      >
        <ListFieldGroup
          items={values.preRequisites}
          placeholder="Basic JavaScript knowledge"
          onChange={(index, value) => updateListItem("preRequisites", index, value)}
          onAdd={() => addListItem("preRequisites")}
          onRemove={(index) => removeListItem("preRequisites", index)}
        />
      </CourseFormSection>

      <CourseFormSection
        label="Curriculum"
        title="Course content"
        description="Add lessons with video details. Each lesson becomes part of the structured path."
      >
        <div className="space-y-4">
          {values.courseData.map((lesson, index) => (
            <div
              key={lesson.key}
              className="rounded-[14px] border border-border bg-surface/40 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[13px] font-medium text-foreground">
                  Lesson {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => removeLesson(index)}
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Lesson title"
                  value={lesson.title}
                  onChange={(event) => updateLesson(index, "title", event.target.value)}
                  placeholder="Introduction to React Patterns"
                />
                <Textarea
                  label="Lesson description"
                  value={lesson.description}
                  onChange={(event) =>
                    updateLesson(index, "description", event.target.value)
                  }
                  placeholder="Brief overview of what this lesson covers."
                  className="min-h-[96px]"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Video section"
                    value={lesson.videoSection}
                    onChange={(event) =>
                      updateLesson(index, "videoSection", event.target.value)
                    }
                    placeholder="Module 1"
                  />
                  <Select
                    label="Video player"
                    value={lesson.videoPlayer}
                    onChange={(event) =>
                      updateLesson(index, "videoPlayer", event.target.value)
                    }
                    options={VIDEO_PLAYERS.map((player) => ({
                      value: player,
                      label: player.charAt(0).toUpperCase() + player.slice(1),
                    }))}
                  />
                </div>
                <Input
                  label="Video URL"
                  type="url"
                  value={lesson.videoUrl}
                  onChange={(event) => updateLesson(index, "videoUrl", event.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min="1"
                  step="1"
                  value={lesson.videoLength}
                  onChange={(event) =>
                    updateLesson(index, "videoLength", event.target.value)
                  }
                  placeholder="12"
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="secondary" size="sm" onClick={addLesson}>
          Add lesson
        </Button>
      </CourseFormSection>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/dashboard/courses">
            <Button type="button" variant="secondary" size="md" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="md" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create course"
                : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

interface ListFieldGroupProps {
  items: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const ListFieldGroup: FC<ListFieldGroupProps> = ({
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={index} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label={`Item ${index + 1}`}
            value={item}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={placeholder}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-0.5 shrink-0 text-muted hover:text-foreground"
          onClick={() => onRemove(index)}
          aria-label={`Remove item ${index + 1}`}
        >
          Remove
        </Button>
      </div>
    ))}
    <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
      Add item
    </Button>
  </div>
);

export default CourseForm;
