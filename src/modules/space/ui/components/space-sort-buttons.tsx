import { SortButton } from "@/components/common/sort-button";
import { Skeleton } from "@/components/ui/skeleton";

type SortOption = "newest" | "oldest" | "name" | "summaryCount";

interface SpacesSortButtonsProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  spacesCount: number;
}

export const SpacesSortButtons = ({
  sortBy,
  onSortChange,
  spacesCount,
}: SpacesSortButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
      <div className="text-sm text-muted-foreground">
        총 {spacesCount}개의 스페이스
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SortButton
          active={sortBy === "newest"}
          label="최신순"
          value="newest"
          onClick={onSortChange}
        />
        <SortButton
          active={sortBy === "oldest"}
          label="오래된순"
          value="oldest"
          onClick={onSortChange}
        />
        <SortButton
          active={sortBy === "name"}
          label="이름순"
          value="name"
          onClick={onSortChange}
        />
        <SortButton
          active={sortBy === "summaryCount"}
          label="요약 많은순"
          value="summaryCount"
          onClick={onSortChange}
        />
      </div>
    </div>
  );
};

export const SpacesSortButtonsSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
      <div className="text-sm text-muted-foreground">
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
};
