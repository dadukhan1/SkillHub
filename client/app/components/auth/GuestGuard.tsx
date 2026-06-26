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
  const { isChecking, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isChecking && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isChecking, isAuthenticated, router]);

  if (isChecking) return <AuthLoadingScreen />;
  if (isAuthenticated) return null;

  return <>{children}</>;
};

export default GuestGuard;
