"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const UserPlanInfo = () => {
  const trpc = useTRPC();

  const { data: userInfo, isLoading } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );
  const userPlan = userInfo?.subscription?.plan;

  if (isLoading) {
    return (
      <Card className="p-3 flex flex-col gap-1.5">
        <Skeleton className="h-5 w-24 rounded-md" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-between">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-10 rounded-md" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 flex flex-col gap-1.5">
      <h5 className="text-sm font-semibold">{userPlan?.name || "Free"} 플랜</h5>
      <div className="space-y-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-xs text-muted-foreground">스페이스 수</span>
          <span className="text-xs text-muted-foreground">
            {userInfo?.spaceCount} / {userPlan?.features.maxSpaceCount || 1}
          </span>
        </div>
        <Progress
          value={
            ((userInfo?.spaceCount || 0) /
              (userPlan?.features.maxSpaceCount || 1)) *
            100
          }
        />
      </div>
    </Card>
  );
};
