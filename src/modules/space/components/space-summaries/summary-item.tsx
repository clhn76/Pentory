"use client";

import { Card, CardContent } from "@/components/ui/card";
import { extractMarkdownContent } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { memo, useMemo } from "react";
import { useSpaceSummaryDialogStore } from "../../stores/use-space-summary-dialog-store";

interface SummaryItemProps {
  id: string;
  createdAt: string;
  url: string;
  content: string | null;
  thumbnailUrl: string | null;
  sourceName: string;
}

export const SummaryItem = memo(
  ({
    id,
    createdAt,
    url,
    content,
    thumbnailUrl,
    sourceName,
  }: SummaryItemProps) => {
    const { openDialog } = useSpaceSummaryDialogStore();

    const extractedContent = useMemo(() => {
      if (!content) return { title: "", content: "" };
      return extractMarkdownContent(content);
    }, [content]);

    return (
      <Card
        className="h-full pt-0 overflow-clip cursor-pointer hover:scale-[102%] transition-all duration-300 gap-4"
        onClick={() => openDialog(id)}
      >
        <div className="relative w-full aspect-video">
          <Image
            loading="lazy"
            className="w-full object-cover pointer-events-none"
            fill
            unoptimized
            src={thumbnailUrl || "/placeholder.jpg"}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
            alt={content?.slice(0, 50) || url}
          />
        </div>
        <CardContent className="h-full flex flex-col px-4 md:px-5">
          <div className="flex-1">
            {content && (
              <>
                <h3 className="text-lg tracking-tight font-bold mb-2 line-clamp-2">
                  {extractedContent.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-5">
                  {extractedContent.content}
                </p>
              </>
            )}
          </div>
          <div className="flex justify-between items-center mt-6 gap-4">
            <p className="text-xs text-muted-foreground line-clamp-1 border rounded-md px-2 py-0.5">
              {sourceName}
            </p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {format(createdAt, "yyyy.MM.dd")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);

SummaryItem.displayName = "SummaryItem";
