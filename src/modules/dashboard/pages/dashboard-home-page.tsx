import { RecentUpdatedSpaces } from "@/modules/space/components/recent-updated-spaces";
import { WeeklySummaryChart } from "@/modules/space/components/weekly-summary-chart";
import { BannerSection } from "../components/banner-section";

export const DashboardHomePage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* 배너 섹션 */}
      <BannerSection />

      {/* 주별 요약 통계 차트 */}
      <WeeklySummaryChart />

      {/* 최근 업데이트된 스페이스 */}
      <RecentUpdatedSpaces />
    </div>
  );
};
