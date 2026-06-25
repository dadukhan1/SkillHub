"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";

const navLinks = [
  { label: "Courses", href: "#courses" },
  { label: "Paths", href: "#paths" },
  { label: "Instructors", href: "#instructors" },
  { label: "Pricing", href: "#pricing" },
];

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
        >
          SkillHub
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[10px] px-3.5 py-2 text-[13px] text-muted transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/signin"
            className="hidden text-[13px] text-muted transition-colors duration-200 hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <ThemeToggle />
          <Link href="/signup" className="hidden sm:block">
            <Button size="sm">Get started</Button>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-border md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-300 md:hidden",
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-0.5 px-5 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-[10px] px-3 py-2.5 text-[13px] text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/signup" onClick={() => setMenuOpen(false)} className="mt-3">
            <Button className="w-full" size="sm">Get started</Button>
          </Link>
          <Link
            href="/signin"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-[10px] px-3 py-2.5 text-center text-[13px] text-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
