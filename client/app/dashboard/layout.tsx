import AuthGuard from "@/app/components/auth/AuthGuard";
import DashboardLayoutShell from "@/app/components/dashboard/DashboardLayoutShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayoutShell>{children}</DashboardLayoutShell>
    </AuthGuard>
  );
}
