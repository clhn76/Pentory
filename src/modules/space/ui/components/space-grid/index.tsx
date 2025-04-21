import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SpaceItem } from "./space-item";
import { Space } from "@/modules/space/types";

interface SpacesGridProps {
  spaces: Space[];
}

export const SpacesGrid = ({ spaces }: SpacesGridProps) => {
  if (!spaces || spaces.length === 0) {
    return (
      <div className="text-center text-muted-foreground border border-dashed rounded-lg py-20">
        스페이스가 없습니다. 새 스페이스를 만들어보세요.
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <SpaceItem
          key={space.id}
          space={{
            id: space.id,
            name: space.name,
            description: space.description,
            createdAt: space.createdAt,
            sourceCount: space.sourceCount,
            summaryCount: space.summaryCount,
          }}
        />
      ))}
    </div>
  );
};

export const SpacesGridSkeleton = () => {
  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-[200px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
