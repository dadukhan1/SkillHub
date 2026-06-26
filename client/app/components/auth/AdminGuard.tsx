"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/hooks";
import { isAdmin } from "@/lib/user";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isChecking } = useAuth();

  useEffect(() => {
    if (!isChecking && user && !isAdmin(user.role)) {
      router.replace("/profile");
    }
  }, [isChecking, user, router]);

  if (isChecking) return <AuthLoadingScreen />;
  if (!user || !isAdmin(user.role)) return null;

  return <>{children}</>;
};

export default AdminGuard;
