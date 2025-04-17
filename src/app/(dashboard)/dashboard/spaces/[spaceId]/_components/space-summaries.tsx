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

      <section className="mt-8 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
