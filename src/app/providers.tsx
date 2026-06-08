"use client";

import { useEffect } from "react";
import { UIProvider } from "@/components/UIProvider";
import ToastViewport from "@/components/ToastViewport";
import { BP } from "@/lib/paths";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${BP}/sw.js`).catch(() => {});
    }
  }, []);
  return (
    <UIProvider>
      <ToastViewport />
      {children}
    </UIProvider>
  );
}
