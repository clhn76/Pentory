import { RecentUpdatedSpaces } from "../../../space/ui/components/recent-updated-spaces";
import { WeeklySummaryChart } from "../../../space/ui/components/weekly-summary-chart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DashboardHomePage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* 배너 섹션 */}
      <div className="flex flex-col xl:flex-row gap-4 mb-8">
        {/* URL 요약 배너 */}
        <Card className="p-6 flex-1 bg-gradient-to-r from-blue-900 to-indigo-900/50 border-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-100">URL 요약</h2>
              <p className="text-blue-200/70">
                유튜브, 블로그, 뉴스 등의 URL 주소만으로 콘텐츠의 핵심내용을
                요약 정리해 드립니다.
              </p>
            </div>
            <Link href="/dashboard/summary/url">
              <Button size="lg" className="whitespace-nowrap ">
                URL 요약하기
              </Button>
            </Link>
          </div>
        </Card>

        {/* 요약 스페이스 배너 */}
        <Card className="p-6 flex-1 bg-gradient-to-r from-purple-900 to-pink-900/50 border-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-purple-100">
                요약 스페이스
              </h2>
              <p className="text-purple-200/70">
                원하는 유튜브 채널, 블로그 RSS를 등록하고 매일매일 최신 콘텐츠를
                자동으로 요약받아보세요.
              </p>
            </div>
            <Link href="/dashboard/spaces">
              <Button size="lg" className="whitespace-nowrap">
                요약 스페이스
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 주별 요약 통계 차트 */}
      <WeeklySummaryChart />

      {/* 최근 업데이트된 스페이스 */}
      <RecentUpdatedSpaces />
    </div>
  );
};
