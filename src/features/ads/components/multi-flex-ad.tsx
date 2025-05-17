"use client";

import { cn } from "@/lib/utils";
import useAdsense from "../hooks/use-adsense.hook";
import { ClassValue } from "clsx";
import { useGetUserInfo } from "@/features/user/hooks/use-get-user-info.hook";

interface Props {
  className?: ClassValue;
}

export default function MultiFlexAd({ className }: Props) {
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
        className
      )}
      style={{ display: "block" }}
      data-ad-format="autorelaxed"
      data-ad-client="ca-pub-8222693996695565"
      data-ad-slot="3911323877"
    >
      {process.env.NODE_ENV === "development" && (
        <p className="p-2 text-blue-500 no-underline">multi-flex-ad</p>
      )}
    </ins>
  );
}
