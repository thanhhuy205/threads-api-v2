"use client";

import { ModalProvider } from "@/components/layout/ModalProvider";
import { RealtimeProvider } from "@/components/layout/RealtimeProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import AuthProvider from "@/features/auth/components/AuthProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

const storageKey = "pulseboard-ui-theme";
const AliveScope = dynamic(
  () => import("react-activation").then((mod) => mod.AliveScope),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey={storageKey}>
            <RealtimeProvider>
              <AliveScope>{children}</AliveScope>
              <ModalProvider />
              <Toaster position="bottom-center" />
            </RealtimeProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}

export { useTheme } from "@/components/layout/ThemeProvider";
