"use client";

import { useEffect, useState } from "react";

/**
 * 미디어 쿼리 문자열을 받아 해당 미디어 쿼리가 현재 뷰포트와 일치하는지 여부를 반환하는 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: "(min-width: 768px)")
 * @returns boolean - 미디어 쿼리가 일치하는지 여부
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR 환경에서는 window 객체가 없으므로 체크
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // 초기 상태 설정
    setMatches(mediaQuery.matches);

    // 미디어 쿼리 변경 이벤트 리스너
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener("change", handleChange);

    // 클린업 함수
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};
