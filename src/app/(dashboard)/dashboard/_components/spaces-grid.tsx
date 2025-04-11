"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const SpacesGrid = () => {
  const trpc = useTRPC();

  const { data: spaces } = useSuspenseQuery(
    trpc.spaceRouter.getSpaces.queryOptions()
  );

  if (spaces.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground border border-dashed rounded-lg py-20">
        스페이스가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1  md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export const SpacesGridSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-1  md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="h-[120px] rounded-md" />
      ))}
    </div>
  );
};
