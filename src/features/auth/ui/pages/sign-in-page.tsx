import { Logo } from "@/components/common/logo";
import { Card } from "@/components/ui/card";
import { GoogleSignInButton } from "../components/google-sign-in-button";

export const SignInPage = () => {
  return (
    <Card className="w-full max-w-md flex flex-col items-center justify-center gap-8 p-6">
      <Logo />

      <GoogleSignInButton />
    </Card>
  );
};
