"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full"
      size="lg"
    >
      Google Login
    </Button>
  );
};
