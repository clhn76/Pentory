import { Skeleton } from "@/components/ui/skeleton";

export const TopContentSkeleton = () => {
  return (
    <div className="flex items-center gap-3 w-full p-2 rounded-lg">
      <Skeleton className="h-4 w-4 rounded-sm" />
      <div className="relative aspect-video max-w-24 md:max-w-40 flex-1">
        <Skeleton className="absolute left-0.5 top-0.5 h-5 w-6 rounded-sm" />
        <Skeleton className="h-full w-full rounded-md" />
      </div>
      <div className="min-h-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
