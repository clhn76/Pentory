import { Skeleton } from "@/components/ui/skeleton";

export const SpaceSummarySkeleton = () => {
  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      <div className="w-full relative aspect-video overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2 ml-auto">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};
