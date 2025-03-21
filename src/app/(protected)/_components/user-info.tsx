"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/server/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const UserInfo = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.sampleRouter.getUser.queryOptions());

  return <div className="p-2">User name: {data.name}</div>;
};

export const UserInfoSkeleton = () => {
  return (
    <div className="p-2">
      <Skeleton className="h-4 w-24" />
    </div>
  );
};
