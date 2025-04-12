"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SpaceItem } from "./space-item";

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className="px-3 py-1">
          총 {spaces.length}개의 스페이스
        </Badge>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceItem key={space.id} space={space} />
        ))}
      </div>
    </div>
  );
};

export const SpacesGridSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton key={index} className="h-[160px] rounded-xl" />
      ))}
    </div>
  );
};
