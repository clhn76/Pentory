import { useLayoutEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function useAdsense() {
  const adRef = useRef<HTMLModElement>(null);

  useLayoutEffect(() => {
    try {
      if (adRef.current && !adRef.current.getAttribute("data-ad-rendered")) {
        // 광고가 아직 렌더링되지 않은 경우에만 초기화
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // 렌더링 표시
        adRef.current.setAttribute("data-ad-rendered", "true");
      }
    } catch (error) {
      console.error("Ad initialization error:", error);
    }
  }, []);

  return {
    adRef,
  };
}
