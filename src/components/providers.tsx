"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ArticleDialog } from "../modules/dialog/components/article-dialog";
import { GlobalAlertDialog } from "../modules/dialog/components/global-alert-dialog";
import { Toaster } from "./ui/sonner";
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
          <ArticleDialog />
          <Toaster />
        </NuqsAdapter>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
