"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NotFound() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      {
        scale: 0.5,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    )
      .fromTo(
        contentRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        "-=0.3"
      )
      .fromTo(
        buttonRef.current,
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        "-=0.3"
      );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 ref={titleRef} className="text-9xl font-bold text-primary">
            404
          </h1>
          <div ref={contentRef} className="space-y-4">
            <h2 className="text-3xl font-semibold text-foreground">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              홈페이지로 돌아가서 다시 시도해보세요.
            </p>
          </div>
        </div>

        <div ref={buttonRef}>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
