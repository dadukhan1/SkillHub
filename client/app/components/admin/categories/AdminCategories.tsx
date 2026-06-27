"use client";

import { FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/app/components/ui/Button";
import AdminLoadingState from "@/app/components/admin/AdminLoadingState";
import {
  useGetLayoutByTypeQuery,
  useEditLayoutMutation,
} from "@/redux/features/layoutApiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";

const AdminCategories: FC = () => {
  const { data, isLoading, isError, refetch } =
    useGetLayoutByTypeQuery("Categories");
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();

  const [categories, setCategories] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories.map((c) => c.title));
    }
  }, [data]);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingIndex]);

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditingValue(categories[i]);
  };

  const commitEdit = (i: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      setEditingIndex(null);
      return;
    }
    setCategories((prev) => prev.map((c, idx) => (idx === i ? trimmed : c)));
    setEditingIndex(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    if (e.key === "Enter") commitEdit(i);
    if (e.key === "Escape") setEditingIndex(null);
  };

  const addCategory = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    if (categories.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      toast.error("This category already exists.");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewTitle("");
  };

  const removeCategory = (i: number) => {
    setCategories((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (categories.length === 0) {
      toast.error("Please add at least one category.");
      return;
    }
    try {
      await editLayout({
        type: "Categories",
        categories: categories.map((title) => ({ title })),
      }).unwrap();
      toast.success("Categories saved successfully!");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save categories."));
    }
  };

  if (isLoading) return <AdminLoadingState />;

  if (isError) {
    return (
      <div className="rounded-[14px] border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-500">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl pb-32">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 -mx-4 mb-8 flex items-center justify-between border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div>
          <p className="label text-[11px]">Content Management</p>
          <p className="mt-0.5 text-[15px] font-semibold text-foreground">
            Manage Categories
            {categories.length > 0 && (
              <span className="ml-2 rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-normal text-muted">
                {categories.length} item{categories.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isEditing}>
          {isEditing ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {/* Add new category */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name…"
          className="flex-1 rounded-[12px] border border-border bg-card px-4 py-2.5 text-[14px] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-accent/40 focus:ring-2 focus:ring-ring"
        />
        <Button
          size="sm"
          onClick={addCategory}
          disabled={!newTitle.trim()}
        >
          Add
        </Button>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="rounded-[14px] border border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border text-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-foreground">No categories yet</p>
          <p className="mt-1 text-[13px] text-muted">
            Type a category name above and press Enter or click &quot;Add&quot;.
          </p>
        </div>
      )}

      {/* Category chips / list */}
      {categories.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group flex min-h-[52px] items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3 transition-all duration-200 hover:border-foreground/15 hover:shadow-sm"
            >
              {/* Tag icon */}
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] border border-border text-muted">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </span>

              {/* Inline edit or label */}
              {editingIndex === i ? (
                <input
                  ref={inputRef}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => commitEdit(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="flex-1 rounded-[8px] border border-border bg-background px-2 py-1 text-[14px] font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <span
                  className="flex-1 cursor-text truncate text-[14px] font-medium text-foreground"
                  onDoubleClick={() => startEdit(i)}
                  title="Double-click to edit"
                >
                  {cat}
                </span>
              )}

              {/* Actions — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {editingIndex !== i && (
                  <button
                    onClick={() => startEdit(i)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-border/50 hover:text-foreground"
                    title="Edit"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => removeCategory(i)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Remove"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <p className="mt-4 text-[12px] text-muted">
          Tip: Double-click any category to rename it inline.
        </p>
      )}
    </div>
  );
};

export default AdminCategories;
