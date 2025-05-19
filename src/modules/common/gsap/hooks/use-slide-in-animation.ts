import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SlideInAnimationOptions {
  duration?: number;
  stagger?: number;
  xOffset?: number;
  ease?: string;
}

export const useSlideInAnimation = <T extends HTMLElement>(
  selector: string,
  options: SlideInAnimationOptions = {}
) => {
  const containerRef = useRef<T>(null);
  const {
    duration = 0.5,
    stagger = 0.2,
    xOffset = 100,
    ease = "power2.out",
  } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);

    gsap.set(elements, {
      x: xOffset,
      opacity: 0,
    });

    gsap.to(elements, {
      x: 0,
      opacity: 1,
      duration,
      stagger,
      ease,
    });
  }, [selector, duration, stagger, xOffset, ease]);

  return containerRef;
};
