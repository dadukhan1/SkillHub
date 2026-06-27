"use client";

import { FC, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useSocialAuthMutation } from "@/redux/features/apiSlice";
import { getErrorMessage } from "@/redux/utils/getErrorMessage";
import AuthLoadingScreen from "@/app/components/auth/AuthLoadingScreen";

const SocialCallbackPage: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [socialAuth] = useSocialAuthMutation();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status === "loading" || hasSynced.current) return;

    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    const email = session?.user?.email;
    if (!email) {
      router.replace("/signin");
      return;
    }

    hasSynced.current = true;

    socialAuth({
      name: session.user?.name ?? email.split("@")[0],
      email,
      avatar: session.user?.image ?? undefined,
    })
      .unwrap()
      .then((result) => {
        toast.success("Welcome back!");
        router.replace("/");
      })
      .catch((error) => {
        toast.error(getErrorMessage(error, "Social sign-in failed."));
        router.replace("/signin");
      });
  }, [session, status, socialAuth, router]);

  return <AuthLoadingScreen />;
};

export default SocialCallbackPage;
