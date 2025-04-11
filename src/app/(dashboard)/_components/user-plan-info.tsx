"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetUserInfo } from "@/hooks/use-get-user-info";

export const UserPlanInfo = () => {
  const userInfo = useGetUserInfo();
  const userPlan = userInfo.subscription?.plan;

  return (
    <Card className="p-3 flex flex-col gap-1.5">
      <h5 className="text-sm font-semibold">{userPlan?.name || "Free"} 플랜</h5>
      <div className="space-y-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-xs text-muted-foreground">스페이스 수</span>
          <span className="text-xs text-muted-foreground">
            {userInfo.spaceCount} / {userPlan?.features.maxSpaceCount || 1}
          </span>
        </div>
        <Progress
          value={
            (userInfo.spaceCount / (userPlan?.features.maxSpaceCount || 1)) *
            100
          }
        />
      </div>
    </Card>
  );
};
