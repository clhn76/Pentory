"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SpacesGrid, SpacesGridSkeleton } from "../components/space-grid";
import { Pagination } from "@/components/common/pagination";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { SPACE_HREF_PREFIX } from "../config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PublicSpacesPage = () => {
  const trpc = useTRPC();
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search");
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("summaryCount")
  );
  const debouncedSearch = useDebounce(search, 300);
  const itemsPerPage = 12;

  const { data: publicSpaces, isLoading } = useQuery(
    trpc.spaceRouter.getPublicSpaces.queryOptions({
      page: page ?? 1,
      limit: itemsPerPage,
      search: debouncedSearch ?? "",
      sortBy: sortBy as "summaryCount" | "subscriberCount" | "createdAt",
    })
  );

  const totalPages = Math.ceil((publicSpaces?.total || 0) / itemsPerPage);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">스페이스 둘러보기</h1>
          <p className="text-lg text-muted-foreground max-w-screen-md text-balance break-keep leading-relaxed tracking-tight">
            스페이스 둘러보기에서는 다른 사용자가 생성한 공개 요약 스페이스를
            둘러볼 수 있고 해당 스페이스를 구독할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="스페이스 검색..."
              value={search ?? ""}
              onChange={(e) => setSearch(e.target.value || null)}
              className="pl-8"
            />
          </div>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summaryCount">요약 많은 순</SelectItem>
              <SelectItem value="subscriberCount">구독 많은 순</SelectItem>
              <SelectItem value="createdAt">최신 순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div>
          <SpacesGridSkeleton />
        </div>
      ) : (
        <div>
          <SpacesGrid
            spaces={publicSpaces?.items || []}
            hrefPrefix={SPACE_HREF_PREFIX.PUBLIC}
          />

          {/* 페이지네이션 컨트롤 */}
          <div className="mt-6">
            <Pagination
              currentPage={page ?? 1}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
