import type { Metadata } from "next";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import ProfileSettings from "@/app/components/dashboard/profile/ProfileSettings";

export const metadata: Metadata = {
  title: "Profile — SkillHub",
  description: "Manage your SkillHub profile, avatar, and account settings.",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <DashboardHeader
        title="Profile"
        description="Manage your personal information, profile picture, and password."
      />
      <div className="mt-8">
        <ProfileSettings />
      </div>
    </div>
  );
}
