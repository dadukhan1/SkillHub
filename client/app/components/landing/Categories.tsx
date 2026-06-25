import { FC, ReactNode } from "react";
import Link from "next/link";
import { categories } from "@/lib/mock-data";
import SectionHeader from "../ui/SectionHeader";

const icons: Record<string, ReactNode> = {
  code: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="8.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="12.5" r="2.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.672 0-.437-.18-.835-.437-1.184-.22-.303-.39-.635-.39-1.016 0-.83.67-1.5 1.5-1.5H16c3.314 0 6-2.686 6-6 0-4.5-4.5-8-10-8z" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  briefcase: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  megaphone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11 13v8a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-8" />
    </svg>
  ),
  sparkles: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8H4.3l4.9 3.5-1.9 5.8L12 14.6l4.7 3.5-1.9-5.8 4.9-3.5h-5.8L12 3z" />
    </svg>
  ),
};

const Categories: FC = () => (
  <section className="border-y border-border bg-surface py-24 sm:py-32">
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <SectionHeader
        label="Explore"
        title="Find your path"
        description="Browse by discipline. Each category is curated with learning paths designed for progressive mastery."
        className="mb-14"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`#courses?category=${category.id}`}
            className="group flex items-center gap-4 rounded-[14px] border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/10 hover:shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-muted transition-colors duration-200 group-hover:text-foreground">
              {icons[category.icon]}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium tracking-[-0.01em]">{category.name}</p>
              <p className="mt-0.5 text-[13px] text-muted">{category.count} courses</p>
            </div>
            <svg
              className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
