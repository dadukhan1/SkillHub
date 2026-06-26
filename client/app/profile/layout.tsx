import AuthGuard from "@/app/components/auth/AuthGuard";
import ProfileLayoutShell from "@/app/components/profile/ProfileLayoutShell";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ProfileLayoutShell>{children}</ProfileLayoutShell>
    </AuthGuard>
  );
}
