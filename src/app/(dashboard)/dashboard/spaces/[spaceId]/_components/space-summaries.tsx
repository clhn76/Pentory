"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SummaryItem } from "./summary-item";

interface SpaceSummariesProps {
  spaceId: string;
}

export const SpaceSummaries = ({ spaceId }: SpaceSummariesProps) => {
  const trpc = useTRPC();

  const space = useSuspenseQuery(
    trpc.spaceRouter.getSpaceById.queryOptions({ spaceId })
  );

  return (
    <div className="mt-4">
      <div className="space-y-1 px-2">
        <h1 className="text-2xl font-bold truncate">{space.data?.name}</h1>
        <p className="text-sm text-muted-foreground">
          {space.data?.description}
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {space.data?.summaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-sm text-muted-foreground">
              요약 콘텐츠가 없습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              요약 소스가 등록된 후 일정 시간 후 요약 콘텐츠가 발행됩니다.
            </p>
          </div>
        ) : (
          space.data?.summaries.map((summary) => (
            <SummaryItem
              key={summary.id}
              id={summary.id}
              createdAt={summary.createdAt}
              url={summary.url}
              content={summary.content}
              thumbnailUrl={summary.thumbnailUrl}
              sourceName={summary.spaceSource.name}
            />
          ))
        )}
      </section>
    </div>
  );
};

export const SpaceSummariesSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
    </div>
  );
};
