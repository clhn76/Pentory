"use client";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { LANDING_NAVS } from "@/modules/landing/config";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const headerBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerElement = headerRef.current;
    const logoElement = logoRef.current;
    const navElement = navRef.current;
    const navItems = navItemsRef.current;
    const headerBg = headerBgRef.current;

    if (!headerElement || !logoElement || !navElement || !headerBg) return;

    // 타임라인 생성
    const tl = gsap.timeline({
      defaults: { ease: "circ.out" },
    });

    // 초기 상태 설정
    gsap.set(headerElement, {
      width: "60px",
      height: "60px",
      overflow: "hidden",
    });

    gsap.set(headerBg, {
      scale: 0.3,
      borderRadius: "50%",
    });

    gsap.set(logoElement, {
      scale: 0.5,
      opacity: 0,
      rotation: -10,
    });

    gsap.set(navElement, {
      opacity: 0,
      y: 20,
    });

    gsap.set(navItems, {
      opacity: 0,
      y: 15,
      scale: 0.8,
      stagger: 0.05,
    });

    // 애니메이션 시퀀스
    tl.to(headerBg, {
      scale: 1,
      opacity: 1,
      borderRadius: "50px",
      duration: 1.4,
      ease: "circ.out",
      delay: 0.4,
    })
      .to(
        headerElement,
        {
          width: "100%",
          height: "auto",
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1.2"
      )
      .to(
        logoElement,
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.9"
      )
      .to(
        navElement,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .to(
        navItems,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.4"
      );

    // 오버샷 효과 (더 쫀득한 느낌을 위해)
    tl.to(
      headerBg,
      {
        scaleX: 1.03,
        duration: 0.2,
        ease: "power1.inOut",
      },
      "-=0.2"
    ).to(
      headerBg,
      {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.out",
      },
      ">"
    );

    // 클린업 함수
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="max-w-screen-lg z-50 fixed top-4 left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
    >
      <div
        ref={headerBgRef}
        className="absolute inset-0 backdrop-blur-md border bg-input -z-10"
      ></div>
      <div className="py-2 px-3 flex items-center justify-between w-full">
        <div ref={logoRef}>
          <Logo />
        </div>
        <nav ref={navRef} className="flex items-center gap-2">
          {LANDING_NAVS.map((item, index) => (
            <Link
              href={item.href}
              key={item.label}
              ref={(el) => {
                navItemsRef.current[index] = el;
              }}
            >
              <Button
                className="rounded-full hover:scale-105 transition-transform"
                variant={item.variant}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
