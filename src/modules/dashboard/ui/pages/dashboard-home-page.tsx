import { RecentUpdatedSpaces } from "../../../space/ui/components/recent-updated-spaces";
import { WeeklySummaryChart } from "../../../space/ui/components/weekly-summary-chart";

export const DashboardHomePage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* 주별 요약 통계 차트 */}
      <WeeklySummaryChart />

      {/* 최근 업데이트된 스페이스 */}
      <RecentUpdatedSpaces />
    </div>
  );
};
