"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GlobalAlertDialog } from "./dialogs/global-alert-dialog";
import { useIsMounted } from "@/hooks/use-is-mounted";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
    >
      <TRPCReactProvider>
        <NuqsAdapter>
          {children}
          <GlobalAlertDialog />
          <Toaster />
        </NuqsAdapter>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
