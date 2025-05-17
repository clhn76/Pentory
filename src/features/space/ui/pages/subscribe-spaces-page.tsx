"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SpacesGrid, SpacesGridSkeleton } from "../components/space-grid";
import { Pagination } from "@/components/common/pagination";
import { useQueryState, parseAsInteger } from "nuqs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export const SubscribeSpacesPage = () => {
  const trpc = useTRPC();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search");
  const debouncedSearch = useDebounce(search, 300);
  const itemsPerPage = 12;

  const { data: spaces, isLoading } = useQuery(
    trpc.spaceRouter.getSubscribedSpaces.queryOptions({
      page: page ?? 1,
      limit: itemsPerPage,
      search: debouncedSearch ?? "",
    })
  );

  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">구독 스페이스</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="스페이스 검색..."
            value={search ?? ""}
            onChange={(e) => setSearch(e.target.value || null)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div>
          <SpacesGridSkeleton />
        </div>
      ) : (
        <div>
          <SpacesGrid
            spaces={spaces?.items || []}
            hrefPrefix="/dashboard/subscribe-spaces"
          />

          {/* 페이지네이션 컨트롤 */}
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={spaces?.totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
