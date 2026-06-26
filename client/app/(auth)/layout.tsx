import AuthShell from "@/app/components/auth/AuthShell";
import GuestGuard from "@/app/components/auth/GuestGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <AuthShell>{children}</AuthShell>
    </GuestGuard>
  );
}
