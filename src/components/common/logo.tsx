import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  href?: string;
  disabled?: boolean;
}

export const Logo = ({ href, disabled }: LogoProps) => {
  return (
    <Link
      href={href ?? "/"}
      className={cn(
        "text-xl font-semibold px-2",
        disabled && "cursor-not-allowed"
      )}
    >
      Pentory
    </Link>
  );
};
