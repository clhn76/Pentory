"use client";

import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams();

  const handleGoogleSignInButton = () => {
    const next = searchParams.get("next");

    signIn("google", {
      redirectTo: next ?? "/dashboard",
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignInButton}
      className="w-full h-11"
      size="lg"
    >
      <GoogleIcon className="size-5" />
      <span>구글 계정으로 시작하기</span>
    </Button>
  );
};
