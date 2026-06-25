import { FC } from "react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Courses", href: "#courses" },
    { label: "Paths", href: "#paths" },
    { label: "Pricing", href: "#pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const Footer: FC = () => (
  <footer className="border-t border-border">
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-70"
          >
            SkillHub
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
            Premium learning for ambitious professionals. Crafted with care, designed for growth.
          </p>
        </div>

        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <p className="text-[13px] font-medium">{group}</p>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
        <p className="text-[13px] text-muted">
          © {new Date().getFullYear()} SkillHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
