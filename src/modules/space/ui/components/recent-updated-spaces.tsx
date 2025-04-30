"use client";

import { Button } from "@/components/ui/button";
import {
  SpacesGrid,
  SpacesGridSkeleton,
} from "@/modules/space/ui/components/space-grid";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export const RecentUpdatedSpaces = () => {
  const trpc = useTRPC();

  const { data: spaces, isLoading } = useQuery(
    trpc.spaceRouter.getRecentUpdatedSpaces.queryOptions()
  );

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="title">최근 요약된 스페이스</h2>
        <Link href="/dashboard/spaces">
          <Button variant="outline" size="sm">
            전체 보기 <ArrowRightIcon className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <SpacesGridSkeleton />
      ) : !spaces || spaces.length === 0 ? (
        <div className="text-center text-muted-foreground border border-dashed rounded-lg py-10">
          최근 요약된 스페이스가 없습니다.
          <div className="mt-4">
            <Link href="/dashboard/spaces/new">
              <Button>
                <PlusIcon /> 새 스페이스 만들기
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <SpacesGrid spaces={spaces} hrefPrefix="/dashboard/spaces" />
      )}
    </div>
  );
};
