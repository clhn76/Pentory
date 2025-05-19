import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { AdsenseProvider } from "@/modules/common/adsense/layouts/adsense-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "./fonts/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-SemiBold.subset.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pentory AI | 펜토리 AI",
  description:
    "정보의 홍수 속에서 핵심만 챙겨 보세요. 유튜브와 블로그의 최신 콘텐츠를 AI가 요약하여 매일 전달해 드립니다.",
  keywords: [
    "유튜브 요약",
    "블로그 요약",
    "AI 요약",
    "최신 콘텐츠",
    "최신 뉴스",
    "최신 트렌드",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(pretendard.className, "antialiased")}
        suppressHydrationWarning
      >
        <AdsenseProvider>
          <Providers>{children}</Providers>
        </AdsenseProvider>
      </body>
    </html>
  );
}
