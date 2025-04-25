"use client";

import { Button } from "@/components/ui/button";
import gsap from "gsap";
import Link from "next/link";
import { useEffect } from "react";

export const Hero = () => {
  useEffect(() => {
    gsap.fromTo(
      ".pop-up",
      {
        opacity: 0,
        translateY: "150%",
      },
      {
        opacity: 1,
        translateY: 0,
        duration: 1,
        stagger: 0.5,
        ease: "circ.out",
      }
    );
  }, []);

  return (
    <div className="w-full h-screen relative flex items-center justify-center">
      <div className="z-10 text-center">
        <div className="overflow-hidden">
          <h1 className="pop-up text-6xl tracking-tighter font-bold mb-6">
            더 스마트하게, 더 편하게, 더 창의적으로
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            id="hero-description"
            className="pop-up leading-relaxed text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            여러분의 시간은 소중하니깐, 쏟아지는 정보들 속에서 핵심 정보만
            찾아보세요! 유튜브, 블로그등의 최신 콘텐츠를 요약해서 핵심
            인사이트만 뽑아보세요.
          </p>
        </div>
        <div className="pop-up">
          <Link href="/dashboard">
            <Button size="lg">시작하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
