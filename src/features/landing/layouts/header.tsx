"use client";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { LANDING_NAVS } from "@/features/landing/config";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const Header = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const logo = logoRef.current;
    if (!logo) return;

    const tl = gsap.timeline({
      defaults: {
        ease: "circ.out",
      },
    });

    // 초기 상태 설정
    tl.fromTo(
      bg,
      {
        width: 15,
        height: 15,
        margin: "auto auto",
        background: "white",
      },
      {
        width: "100%",
        height: "100%",
        background: "#111",
        duration: 1,
        onComplete: () => {
          tl.to(logo, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              tl.to(navItemsRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.1, // 각 항목마다 0.1초 간격으로 등장
              });
            },
          });
        },
      }
    );
  }, []);

  // 참조 배열 초기화 함수
  const addToNavRefs = (el: HTMLAnchorElement | null) => {
    if (el && !navItemsRef.current.includes(el)) {
      navItemsRef.current.push(el);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="relative max-w-screen-lg mx-auto flex items-center justify-between  rounded-full p-3">
        <div
          ref={bgRef}
          className="absolute inset-0 bg-muted/50 backdrop-blur-md rounded-full -z-10 border"
        />

        <Logo ref={logoRef} className="opacity-0 translate-y-[20px]" />
        <nav className="flex items-center gap-2">
          {LANDING_NAVS.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              ref={addToNavRefs}
              className="opacity-0 translate-y-[20px]"
            >
              <Button className="rounded-full" variant={item.variant}>
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
