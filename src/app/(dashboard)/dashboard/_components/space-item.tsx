import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

interface SpaceItemProps {
  space: inferRouterOutputs<AppRouter>["spaceRouter"]["getSpaces"][number];
}

export const SpaceItem = ({ space }: SpaceItemProps) => {
  return (
    <Link href={`/dashboard/spaces/${space.id}`}>
      <Card className="h-[160px] group border hover:border-primary/20 hover:bg-muted/30 transition-all duration-300 cursor-pointer">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{space.name}</CardTitle>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarIcon className="size-3" />
            {new Date(space.createdAt).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{space.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
