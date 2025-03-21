import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleLogin } from "./_components/google-login";

const SignInPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleLogin />
      </CardContent>
    </Card>
  );
};

export default SignInPage;
