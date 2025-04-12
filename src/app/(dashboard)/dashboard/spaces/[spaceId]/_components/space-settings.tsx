"use client";

import { SpaceForm } from "@/components/space/space-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface SpaceSettingsProps {
  spaceId: string;
}

export const SpaceSettings = ({ spaceId }: SpaceSettingsProps) => {
  const trpc = useTRPC();

  const space = useSuspenseQuery(
    trpc.spaceRouter.getSpaceById.queryOptions({ spaceId })
  );

  return (
    <div className="max-w-screen-md mx-auto mt-4 space-y-6">
      <h1 className="title">스페이스 설정</h1>
      <SpaceForm space={space.data} />
    </div>
  );
};

export const SpaceSettingsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
    </div>
  );
};
