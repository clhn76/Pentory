import { Card, CardContent } from "@/components/ui/card";

export const SummaryItemSkeleton = () => {
  return (
    <Card className="pt-0 overflow-clip gap-4">
      <div className="relative w-full aspect-video bg-muted animate-pulse" />
      <CardContent className="h-full flex flex-col px-4 md:px-5">
        <div className="flex-1">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};
