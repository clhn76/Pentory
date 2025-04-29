"use client";

import { Button } from "@/components/ui/button";
import gsap from "gsap";
import Link from "next/link";
import { useEffect } from "react";
import { WavyBackground } from "./wavy-background";

export const Hero = () => {
  useEffect(() => {
    // 텍스트 애니메이션
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
    <WavyBackground
      colors={["#ccc", "#aaa", "#999"]}
      waveOpacity={0.3}
      backgroundFill="black"
      blur={0}
      speed="slow"
      waveWidth={4}
      waveCount={6}
    >
      <div className="w-full h-screen relative flex items-center justify-center overflow-hidden">
        {/* 텍스트 */}
        <div className="z-10 text-center">
          <div className="overflow-hidden">
            <h1 className="pop-up text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-tight font-bold mb-4 sm:mb-6 text-white">
              정보의 홍수 속에서
              <br />
              핵심만 챙겨 보세요
            </h1>
          </div>
          <div className="overflow-hidden">
            <p
              id="hero-description"
              className="pop-up mb-6 sm:mb-8 text-lg sm:text-xl opacity-70 px-4"
            >
              유튜브와 블로그의 최신 콘텐츠를 AI가 요약하여 매일 전달해
              드립니다.
            </p>
          </div>
          <div className="pop-up">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-[45px] sm:h-[50px] w-[180px] sm:w-[200px] text-base sm:text-lg font-bold tracking-tight"
              >
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
};
