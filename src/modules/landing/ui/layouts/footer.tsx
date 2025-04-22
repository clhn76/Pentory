import { Logo } from "@/components/common/logo";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container mx-auto space-y-12 md:space-y-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-primary"
            >
              개인정보 처리방침
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary"
            >
              이용약관
            </Link>
            <Link
              href="/refund-policy"
              className="text-muted-foreground hover:text-primary"
            >
              환불 정책
            </Link>
          </div>
        </div>

        <div className="px-4 text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-2">
          <span>현시스템</span>
          <Separator orientation="vertical" style={{ height: "16px" }} />
          <span>대표: 손승현</span>
          <Separator orientation="vertical" style={{ height: "16px" }} />
          <p>사업자등록번호: 642-51-00257</p>
          <Separator orientation="vertical" style={{ height: "16px" }} />
          <p>통신판매업신고: 2025-서울구로-0564</p>
          <Separator orientation="vertical" style={{ height: "16px" }} />
          <p>070-8095-5175</p>
          <Separator orientation="vertical" style={{ height: "16px" }} />
          <p>서울특별시 구로구 디지털로33길 48, 809호</p>
        </div>

        <div className="text-sm text-muted-foreground/50 text-center">
          © {new Date().getFullYear()} Pentory. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
