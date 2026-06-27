"use client";

import { FC, FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CourseFormSection from "@/app/components/admin/course/CourseFormSection";
import SectionEditor from "@/app/components/admin/course/SectionEditor";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Textarea from "@/app/components/ui/Textarea";
import { fileToBase64 } from "@/lib/files";
import {
  COURSE_LEVELS,
  createEmptySection,
  createEmptyVideo,
  formValuesToPayload,
  type CourseFormValues,
  type CourseSectionFormValues,
  type CourseVideoFormValues,
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
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(
    {},
  );
  const [collapsedVideos, setCollapsedVideos] = useState<Record<string, boolean>>({});

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

  const updateSection = (index: number, value: string) => {
    setValues((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, title: value } : section,
      ),
    }));
  };

  const updateVideo = (
    sectionIndex: number,
    videoIndex: number,
    key: keyof CourseVideoFormValues,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      sections: current.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              videos: section.videos.map((video, vIndex) =>
                vIndex === videoIndex ? { ...video, [key]: value } : video,
              ),
            }
          : section,
      ),
    }));
  };

  const addSection = () => {
    const section = createEmptySection();
    setValues((current) => ({
      ...current,
      sections: [...current.sections, section],
    }));
    setCollapsedSections((current) => {
      const next = { ...current };
      delete next[section.key];
      return next;
    });
  };

  const removeSection = (index: number) => {
    const removedSection = values.sections[index];
    setValues((current) => ({
      ...current,
      sections:
        current.sections.length === 1
          ? [createEmptySection()]
          : current.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
    if (removedSection) {
      setCollapsedSections((current) => {
        const next = { ...current };
        delete next[removedSection.key];
        return next;
      });
      setCollapsedVideos((current) => {
        const next = { ...current };
        for (const video of removedSection.videos) {
          delete next[video.key];
        }
        return next;
      });
    }
  };

  const addVideo = (sectionIndex: number) => {
    const video = createEmptyVideo();
    setValues((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, videos: [...section.videos, video] }
          : section,
      ),
    }));
    setCollapsedVideos((current) => {
      const next = { ...current };
      delete next[video.key];
      return next;
    });
  };

  const removeVideo = (sectionIndex: number, videoIndex: number) => {
    const removedVideo = values.sections[sectionIndex]?.videos[videoIndex];
    setValues((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              videos:
                section.videos.length === 1
                  ? [createEmptyVideo()]
                  : section.videos.filter((_, vIndex) => vIndex !== videoIndex),
            }
          : section,
      ),
    }));
    if (removedVideo) {
      setCollapsedVideos((current) => {
        const next = { ...current };
        delete next[removedVideo.key];
        return next;
      });
    }
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((current) => ({
      ...current,
      [key]: !(current[key] ?? true),
    }));
  };

  const toggleVideo = (key: string) => {
    setCollapsedVideos((current) => ({
      ...current,
      [key]: !(current[key] ?? true),
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
      let savedCourseId = courseId;

      if (mode === "create") {
        const result = await createCourse(payload).unwrap();
        savedCourseId = result.course._id;
        toast.success("Course created successfully.");
      } else if (courseId) {
        await editCourse({ id: courseId, body: payload }).unwrap();
        toast.success("Course updated successfully.");
        savedCourseId = courseId;
      }

      if (savedCourseId) {
        router.push(`/courses/${savedCourseId}/preview`);
        router.refresh();
      }
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
          type="text"
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
        description="Organize your course into named sections. Add multiple videos to each section and collapse them to stay focused."
      >
        <div className="space-y-3">
          {values.sections.map((section, sectionIndex) => (
            <SectionEditor
              key={section.key}
              section={section}
              isCollapsed={collapsedSections[section.key] ?? true}
              collapsedVideos={collapsedVideos}
              onToggleSection={() => toggleSection(section.key)}
              onToggleVideo={toggleVideo}
              onUpdateSection={(value) => updateSection(sectionIndex, value)}
              onUpdateVideo={(videoIndex, key, value) =>
                updateVideo(sectionIndex, videoIndex, key, value)
              }
              onAddVideo={() => addVideo(sectionIndex)}
              onRemoveVideo={(videoIndex) => removeVideo(sectionIndex, videoIndex)}
              onRemoveSection={() => removeSection(sectionIndex)}
            />
          ))}
        </div>

        <Button type="button" variant="secondary" size="sm" onClick={addSection}>
          Add section
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
