import AuthGuard from "@/app/components/auth/AuthGuard";
import AdminGuard from "@/app/components/auth/AdminGuard";
import DashboardLayoutShell from "@/app/components/dashboard/DashboardLayoutShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminGuard>
        <DashboardLayoutShell>{children}</DashboardLayoutShell>
      </AdminGuard>
    </AuthGuard>
  );
}
