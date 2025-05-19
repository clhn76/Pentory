import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BannerProps = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  className?: string;
  textColor: string;
  textColorSecondary: string;
};

const Banner = ({
  title,
  description,
  buttonText,
  href,
  className,
  textColor,
  textColorSecondary,
}: BannerProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-8 flex-1 border-none",
        className
      )}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 h-full">
        <div className="space-y-3 max-w-[65%]">
          <h2 className={`text-2xl font-bold ${textColor} leading-tight`}>
            {title}
          </h2>
          <p
            className={`${textColorSecondary} text-sm md:text-base leading-relaxed`}
          >
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
          <Link
            href={href}
            className="w-full md:w-auto"
            aria-label={`${buttonText} 페이지로 이동`}
          >
            <Button size="lg" className="w-full md:w-auto whitespace-nowrap">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export const BannerSection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <Banner
        title="URL 요약"
        description="유튜브, 블로그, 뉴스 등의 URL 주소만으로 콘텐츠의 핵심내용을 요약 정리해 드립니다."
        buttonText="URL 요약하기"
        href="/dashboard/summary/url"
        className="bg-gradient-to-r from-blue-900 to-indigo-900/50"
        textColor="text-blue-100"
        textColorSecondary="text-blue-200/70"
      />
      <Banner
        title="요약 스페이스"
        description="원하는 유튜브 채널, 블로그 RSS를 등록하고 매일매일 최신 콘텐츠를 자동으로 요약받아보세요."
        buttonText="요약 스페이스"
        href="/dashboard/spaces"
        className="bg-gradient-to-r from-purple-900 to-pink-900/50"
        textColor="text-purple-100"
        textColorSecondary="text-purple-200/70"
      />
    </div>
  );
};
