"use client";

import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ArticleDialog } from "../modules/dialog/components/article-dialog";
import { GlobalAlertDialog } from "../modules/dialog/components/global-alert-dialog";
import { Toaster } from "./ui/sonner";
import { useIsMounted } from "@/hooks/use-is-mounted";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// Production 환경에서만 posthog 실행
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
  });
}

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <PostHogProvider client={posthog}>
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
    </PostHogProvider>
  );
};
