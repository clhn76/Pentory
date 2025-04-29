import { Button } from "@/components/ui/button";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-screen-lg mx-auto p-6 sm:p-8 md:p-10 rounded-2xl text-center bg-gradient-to-tr from-primary/5 to-primary/25">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          정보 과부하에서 벗어나세요
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8">
          하루에 5분만 투자하여 최신 트렌드와 정보를 놓치지 마세요.
        </p>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="rounded-full px-6 sm:px-8 text-sm sm:text-base"
          >
            무료로 시작하기
          </Button>
        </Link>
      </div>
    </section>
  );
};
