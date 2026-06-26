"use client";

import { FC } from "react";
import { useAuth } from "@/redux/hooks";
import { getFirstName } from "@/lib/user";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";

const DashboardWelcome: FC = () => {
  const { user } = useAuth();
  const firstName = user ? getFirstName(user.name) : "there";

  return (
    <DashboardHeader
      title={`Good morning, ${firstName}`}
      description="You're on a 14-day streak. Keep the momentum going."
    />
  );
};

export default DashboardWelcome;
