import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { LANDING_NAVS } from "@/modules/landing/config";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="z-50 backdrop-blur-md flex items-center justify-between border bg-input/50 sticky top-2 max-w-screen-lg mx-auto rounded-full py-2 px-3">
      <Logo />
      <nav className="flex items-center gap-2">
        {LANDING_NAVS.map((item) => (
          <Link href={item.href} key={item.label}>
            <Button
              key={item.label}
              className="rounded-full"
              variant={item.variant}
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
};
