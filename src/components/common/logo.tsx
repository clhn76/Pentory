import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import Image from "next/image";
import Link from "next/link";
import { RefObject } from "react";

interface LogoProps {
  href?: string;
  disabled?: boolean;
  ref?: RefObject<HTMLAnchorElement | null>;
  className?: ClassValue;
}

export const Logo = ({ href, disabled, ref, className }: LogoProps) => {
  return (
    <Link
      ref={ref}
      href={href ?? "/"}
      className={cn(
        "text-xl font-semibold px-2",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <Image src="/logo.svg" alt="Pentory" width={80} height={34} />
    </Link>
  );
};
