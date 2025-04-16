import Link from "next/link";

interface LogoProps {
  href?: string;
}

export const Logo = ({ href }: LogoProps) => {
  return (
    <Link href={href ?? "/"} className="text-xl font-semibold px-2">
      Pentory
    </Link>
  );
};
