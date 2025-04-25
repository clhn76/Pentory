"use client";

import { LoaderIcon } from "@/components/icons/loader-icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 탭이 활성화되었을 때 데이터 로드
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      ...trpc.spaceRouter.getSummariesBySpaceId.infiniteQueryOptions({
        spaceId,
        limit: 12,
      }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: true, // 컴포넌트가 마운트될 때 자동으로 데이터 로드
    });

  useEffect(() => {
    // IntersectionObserver 설정
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return <SpaceSummariesSkeleton />;
  }

  if (status === "error") {
    return <div>오류가 발생했습니다. 페이지를 새로고침 해주세요.</div>;
  }

  // 첫 페이지의 space 정보 가져오기
  const spaceInfo = data.pages[0].space;

  // 모든 페이지의 items 합치기
  const allSummaries = data.pages.flatMap((page) => page.items);

  return (
    <div className="mt-4">
      <SpaceInfo
        name={spaceInfo?.name || ""}
        description={spaceInfo?.description}
        isPublic={spaceInfo?.isPublic || false}
        summaryCount={spaceInfo?.summaryCount || 0}
        sourceCount={spaceInfo?.sourceCount || 0}
        user={!isPersonal ? spaceInfo?.user : undefined}
        isPersonal={isPersonal}
      />

      {allSummaries.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-1">
          <p className="text-sm text-muted-foreground">
            요약 콘텐츠가 없습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            요약 소스가 등록된 후 일정 시간 후 요약 콘텐츠가 발행됩니다.
          </p>
        </div>
      ) : (
        <>
          <section className="mt-8 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {allSummaries.map((summary) => (
              <SummaryItem
                key={summary.id}
                id={summary.id}
                createdAt={summary.createdAt}
                url={summary.url}
                content={summary.content}
                thumbnailUrl={summary.thumbnailUrl}
                sourceName={summary.spaceSource.name}
              />
            ))}
          </section>

          {/* 무한 스크롤 감지용 요소 */}
          <div ref={loadMoreRef} className="h-10 mt-4 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center justify-center">
                <LoaderIcon className="w-4 h-4 mr-2" />
                <span className="ml-2 text-sm text-muted-foreground">
                  불러오는 중...
                </span>
              </div>
            )}

            {!hasNextPage && allSummaries.length > 0 && (
              <p className="text-sm text-muted-foreground py-2">
                모든 콘텐츠를 불러왔습니다.
              </p>
            )}
          </div>

          {/* 수동 로드 버튼 (모바일 터치 환경 고려) */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                더 불러오기
              </Button>
            </div>
          )}
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
