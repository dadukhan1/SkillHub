"use client";

import { FC, ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import AuthInitializer from "@/app/components/auth/AuthInitializer";
import { AppStore, store } from "@/redux/store";

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <AuthInitializer />
      {children}
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </Provider>
  );
};
