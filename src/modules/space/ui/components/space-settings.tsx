"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SpaceForm } from "./space-form";

interface SpaceSettingsProps {
  spaceId: string;
}

export const SpaceSettings = ({ spaceId }: SpaceSettingsProps) => {
  const trpc = useTRPC();

  // 탭이 활성화되었을 때 데이터 로드
  const { data: space, status } = useQuery({
    ...trpc.spaceRouter.getSpaceSettingsById.queryOptions({ spaceId }),
    enabled: true, // 컴포넌트가 마운트될 때 자동으로 데이터 로드
  });

  if (status === "pending") {
    return <SpaceSettingsSkeleton />;
  }

  if (status === "error") {
    return <div>오류가 발생했습니다. 페이지를 새로고침 해주세요.</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto mt-4 space-y-6">
      <h1 className="title">스페이스 설정</h1>
      <SpaceForm space={space} />
    </div>
  );
};

export const SpaceSettingsSkeleton = () => {
  return (
    <div className="max-w-screen-md mx-auto mt-4 space-y-6">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="rounded-lg border border-border p-6 bg-card space-y-6">
        {/* 스페이스 정보 섹션 */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-36" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>

        {/* 요약 스타일 섹션 */}
        <div className="space-y-4 pt-2">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-1/2 rounded-md" />
            <Skeleton className="h-12 w-1/2 rounded-md" />
          </div>
        </div>

        {/* 소스 섹션 */}
        <div className="space-y-4 pt-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-12 w-full rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </div>

        {/* 버튼 */}
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
};
