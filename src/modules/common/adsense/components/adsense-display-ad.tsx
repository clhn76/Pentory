"use client";

import { useGetUserInfo } from "@/modules/user/hooks/use-get-user-info.hook";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import useAdsense from "../hooks/use-adsense.hook";

interface Props {
  className?: ClassValue;
}

export const AdsenseDisplayAd = ({ className }: Props) => {
  const { adRef } = useAdsense();

  const { isUserSubscribedPlan, isLoading } = useGetUserInfo();

  if (isLoading || isUserSubscribedPlan) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={cn(
        "adsbygoogle",
        process.env.NODE_ENV === "development" && "border border-blue-500",
        "h-[90px]",
        className
      )}
      style={{ display: "block" }}
      data-ad-client="ca-pub-8222693996695565"
      data-ad-slot="7505523334"
      data-ad-format="auto"
      data-full-width-responsive="true"
    >
      {process.env.NODE_ENV === "development" && (
        <p className="p-2 text-blue-500 ">display-ad</p>
      )}
    </ins>
  );
};
