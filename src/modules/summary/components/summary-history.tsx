import { SummaryItem } from "@/components/summary/summary-item";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const SummaryHistory = () => {
  const trpc = useTRPC();

  const userSummaries = useQuery(
    trpc.summaryRouter.getUserSummaries.queryOptions()
  );

  return (
    <section className="w-full max-w-2xl">
      <div className="w-full mt-12 flex items-center gap-4 mb-6">
        <div className="h-[1px] w-full bg-muted" />
        <h2 className="text-lg font-medium text-center whitespace-nowrap text-muted-foreground">
          최근 20개 요약 기록
        </h2>
        <div className="h-[1px] w-full bg-muted" />
      </div>
      <div className="space-y-4">
        {userSummaries.isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        {userSummaries.data?.items.length === 0 ? (
          <div className="w-full text-center py-8 text-muted-foreground">
            아직 저장된 요약 기록이 없습니다.
          </div>
        ) : (
          userSummaries.data?.items.map((summary) => (
            <SummaryItem
              key={summary.id}
              createdAt={summary.createdAt}
              url={summary.url}
              content={summary.content}
              thumbnailUrl={summary.thumbnailUrl}
            />
          ))
        )}
      </div>
    </section>
  );
};
