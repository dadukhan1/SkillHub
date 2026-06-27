import AuthGuard from "@/app/components/auth/AuthGuard";

export default function CourseLearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
