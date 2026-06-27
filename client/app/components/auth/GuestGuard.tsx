"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/hooks";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isChecking, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isChecking && isAuthenticated && user) {
      router.replace("/");
    }
  }, [isChecking, isAuthenticated, user, router]);

  if (isChecking) return <AuthLoadingScreen />;
  if (isAuthenticated) return null;

  return <>{children}</>;
};

export default GuestGuard;
