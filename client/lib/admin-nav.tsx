/** @format */

import { ReactNode } from "react";

export interface AdminNavItem {
  label: string;
  href: string;
  enabled: boolean;
  icon: ReactNode;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect width='7' height='9' x='3' y='3' rx='1' />
        <rect width='7' height='5' x='14' y='3' rx='1' />
        <rect width='7' height='9' x='14' y='12' rx='1' />
        <rect width='7' height='5' x='3' y='16' rx='1' />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M3 3v18h18' />
        <path d='m7 16 4-8 4 4 6-8' />
      </svg>
    ),
  },
  {
    label: "Courses",
    href: "/dashboard/courses",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/dashboard/users",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
        <circle cx='9' cy='7' r='4' />
        <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
        <path d='M16 3.13a4 4 0 0 1 0 7.75' />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
        <line x1='3' x2='21' y1='6' y2='6' />
        <path d='M16 10a4 4 0 0 1-8 0' />
      </svg>
    ),
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
        <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z' />
        <path d='M7 7h.01' />
      </svg>
    ),
  },
  {
    label: "FAQ",
    href: "/dashboard/faq",
    enabled: true,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='10' />
        <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
        <path d='M12 17h.01' />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    enabled: false,
    icon: (
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='3' />
        <path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' />
      </svg>
    ),
  },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
