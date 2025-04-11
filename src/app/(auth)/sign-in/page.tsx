import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/logo";
import { GoogleSignInButton } from "./_components/google-sign-in-button";

const SignInPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">
          <Logo />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleSignInButton />
      </CardContent>
    </Card>
  );
};

export default SignInPage;
