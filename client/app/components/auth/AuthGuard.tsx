"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/hooks";
import AuthLoadingScreen from "./AuthLoadingScreen";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isChecking, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isChecking, isAuthenticated, router]);

  if (isChecking) return <AuthLoadingScreen />;
  if (!user) return null;

  return <>{children}</>;
};

export default AuthGuard;
