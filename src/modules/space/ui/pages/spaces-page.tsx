"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import {
  SpacesSortButtons,
  SpacesSortButtonsSkeleton,
} from "../components/space-sort-buttons";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { SpacesGrid, SpacesGridSkeleton } from "../components/space-grid";
import { useQuery } from "@tanstack/react-query";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">전체 요약 스페이스</h1>
        <Link href="/dashboard/spaces/new">
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
            hrefPrefix="/dashboard/spaces"
          />
        </div>
      )}
    </div>
  );
};
