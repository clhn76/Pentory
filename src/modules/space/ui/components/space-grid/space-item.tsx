import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Space } from "@/modules/space/types";
import { CalendarIcon, FileTextIcon, RssIcon } from "lucide-react";
import Link from "next/link";

interface SpaceItemProps {
  space: Space;
}

export const SpaceItem = ({ space }: SpaceItemProps) => {
  return (
    <Link href={`/dashboard/spaces/${space.id}`}>
      <Card className="h-full hover:border-primary/20 hover:bg-muted/30 transition-all duration-300 cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl truncate">{space.name}</CardTitle>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarIcon className="w-3 h-3" />
            {new Date(space.createdAt).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {space.description || "설명이 없습니다."}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <RssIcon className="w-3 h-3" />
            <span>{space.sourceCount || 0} 소스</span>
          </div>
          <div className="flex items-center gap-1">
            <FileTextIcon className="w-3 h-3" />
            <span>{space.summaryCount || 0} 요약</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
