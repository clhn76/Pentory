"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SpacesGrid, SpacesGridSkeleton } from "../components/space-grid";
import {
  SpacesSortButtons,
  SpacesSortButtonsSkeleton,
} from "../components/space-sort-buttons";
import { SPACE_HREF_PREFIX } from "../config";

type SortOption = "newest" | "oldest" | "name" | "summaryCount";

export const SpacesPage = () => {
  const trpc = useTRPC();
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const { data: spaces, isLoading } = useQuery(
    trpc.spaceRouter.getSpaces.queryOptions()
  );

  const sortedSpaces = spaces?.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "summaryCount": {
        const aCount = Number(a.summaryCount) || 0;
        const bCount = Number(b.summaryCount) || 0;
        return bCount - aCount;
      }
      default:
        return 0;
    }
  });

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">전체 요약 스페이스</h1>
          <p className="text-lg text-muted-foreground max-w-screen-md text-balance break-keep leading-relaxed tracking-tight">
            요약 스페이스는 관심 있는 콘텐츠를 자동으로 모아서 매일매일
            요약해주는 개인화된 공간입니다. 유튜브 채널 또는 블로그 RSS URL을
            등록하면 매일 발행되는 신규 콘텐츠를 자동으로 AI가 요약해 드립니다.
          </p>
        </div>

        <Link href={SPACE_HREF_PREFIX.NEW}>
          <Button size="lg">
            <PlusIcon className="w-4 h-4 mr-2" />새 스페이스 만들기
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>
          <SpacesSortButtonsSkeleton />
          <SpacesGridSkeleton />
        </div>
      ) : (
        <div>
          <SpacesSortButtons
            sortBy={sortBy}
            onSortChange={setSortBy}
            spacesCount={spaces?.length || 0}
          />
          <SpacesGrid
            spaces={sortedSpaces || []}
            hrefPrefix={SPACE_HREF_PREFIX.MY}
          />
        </div>
      )}
    </div>
  );
};
