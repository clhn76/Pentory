import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 p-3 flex items-center justify-between">
      <div className="container flex items-center justify-between">
        <Link href="/">Logo</Link>
        <nav className="flex items-center gap-4">
          <Link href="/hello">
            <Button variant="ghost">Hello</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
