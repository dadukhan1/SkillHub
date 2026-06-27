import AuthGuard from "@/app/components/auth/AuthGuard";
import AdminGuard from "@/app/components/auth/AdminGuard";

export default function CoursePreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminGuard>{children}</AdminGuard>
    </AuthGuard>
  );
}
