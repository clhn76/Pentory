"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
}

export const BackButton = ({ href }: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      aria-label="뒤로 가기"
    >
      <ChevronLeft className="h-5 w-5" />
      <span>뒤로 가기</span>
    </Button>
  );
};
