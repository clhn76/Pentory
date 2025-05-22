"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { InfinityScrollObserver } from "@/components/common/infinity-scroll-observer";
import { SummaryItem } from "./summary-item";
import { SpaceInfo } from "./space-info";

interface SpaceSummariesProps {
  spaceId: string;
  isPersonal?: boolean;
}

export const SpaceSummaries = ({
  spaceId,
  isPersonal = false,
}: SpaceSummariesProps) => {
  const trpc = useTRPC();

  const spaceSummaries = useInfiniteQuery(
    trpc.spaceRouter.getSummariesById.infiniteQueryOptions(
      {
        spaceId,
        limit: 12,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  );

  if (spaceSummaries.status === "pending") {
    return <SpaceSummariesSkeleton />;
  }

  if (spaceSummaries.status === "error") {
    return <div>오류가 발생했습니다. 페이지를 새로고침 해주세요.</div>;
  }

  return (
    <div className="mt-4">
      <SpaceInfo isPersonal={isPersonal} />

      {spaceSummaries.data.pages.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-1">
          <p className="text-sm text-muted-foreground">
            요약 콘텐츠가 없습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            설정에서 요약 소스가 등록된 후 일정 시간 후 요약 콘텐츠가
            발행됩니다.
          </p>
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {spaceSummaries.data.pages.map((page) =>
              page.items.map((item) => (
                <SummaryItem
                  key={item.id}
                  id={item.id}
                  createdAt={item.createdAt}
                  url={item.url}
                  content={item.content}
                  thumbnailUrl={item.thumbnailUrl}
                  sourceName={item.spaceSource?.name || ""}
                />
              ))
            )}
          </section>

          <InfinityScrollObserver
            onIntersect={() => {
              if (
                spaceSummaries.hasNextPage &&
                !spaceSummaries.isFetchingNextPage
              ) {
                spaceSummaries.fetchNextPage();
              }
            }}
            isFetching={spaceSummaries.isFetchingNextPage}
            enabled={spaceSummaries.hasNextPage}
          />
        </>
      )}
    </div>
  );
};

export const SpaceSummariesSkeleton = () => {
  return (
    <div className="mt-4">
      <div className="space-y-1 px-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <section className="mt-8 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="overflow-hidden rounded-lg border">
            <Skeleton className="w-full aspect-video" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center mt-6">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
