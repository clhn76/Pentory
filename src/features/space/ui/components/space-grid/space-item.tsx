import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Space } from "@/features/space/types";
import {
  CalendarIcon,
  FileTextIcon,
  RssIcon,
  LockIcon,
  GlobeIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SpaceItemProps {
  space: Space;
  hrefPrefix: string;
}

export const SpaceItem = ({ space, hrefPrefix }: SpaceItemProps) => {
  return (
    <Link href={`${hrefPrefix}/${space.id}`}>
      <Card className="h-full hover:border-primary/20 hover:bg-muted/30 transition-all duration-300 cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl truncate">{space.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {space.description || "설명이 없습니다."}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t pt-3 text-xs">
          {space.user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={space.user.image || undefined} />
                <AvatarFallback>
                  <UserIcon className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{space.user.name}</span>
            </div>
          ) : (
            <Badge
              variant={space.isPublic ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {space.isPublic ? (
                <>
                  <GlobeIcon className="w-3 h-3" />
                  <span>공개</span>
                </>
              ) : (
                <>
                  <LockIcon className="w-3 h-3" />
                  <span>비공개</span>
                </>
              )}
            </Badge>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <RssIcon className="w-3 h-3" />
              <span>{space.sourceCount || 0} 소스</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileTextIcon className="w-3 h-3" />
              <span>{space.summaryCount || 0} 요약</span>
            </div>
            <span className="text-muted-foreground flex items-center gap-1.5">
              <CalendarIcon className="w-3 h-3" />
              {new Date(space.createdAt).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
