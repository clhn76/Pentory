"use client";

import { useArticleDialogStore } from "@/modules/dialog/stores/use-article-dialog-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { marked } from "marked";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SummaryItemProps {
  createdAt: string;
  url: string;
  content: string | null;
  thumbnailUrl: string | null;
  sourceName?: string;
}

export const SummaryItem = ({
  createdAt,
  url,
  content,
  thumbnailUrl,
  sourceName,
}: SummaryItemProps) => {
  const [heading, setTitle] = useState<string>("");
  const [paragraph, setParagraph] = useState<string>("");

  const { openDialog } = useArticleDialogStore();

  useEffect(() => {
    const parseMarkdown = async () => {
      if (!content) return;
      const tokens = marked.lexer(content);

      // 첫 번째 heading 토큰을 찾아 제목으로 설정
      const headingToken = tokens.find((token) => token.type === "heading");
      if (headingToken && "text" in headingToken) {
        setTitle(headingToken.text);
      }

      // 첫 번째 paragraph 토큰을 찾아 내용으로 설정
      const paragraphToken = tokens.find((token) => token.type === "paragraph");
      if (paragraphToken && "text" in paragraphToken) {
        // 마크다운 특수 기호 제거
        const cleanText = paragraphToken.text.replace(/[*_`~#>+-]/g, "");
        setParagraph(cleanText);
      }
    };

    parseMarkdown();
  }, [content]);

  const handleClick = () => {
    openDialog({
      content: content || "",
      source: {
        name: sourceName || "",
        url: url,
      },
      thumbnailUrl: thumbnailUrl || "",
      createdAt: createdAt,
    });
  };

  return (
    <Card
      className="pt-0 overflow-clip cursor-pointer hover:scale-[102%] transition-all duration-300 gap-4"
      onClick={handleClick}
    >
      <div className="relative w-full aspect-video">
        <Image
          className="w-full object-cover pointer-events-none"
          fill
          unoptimized
          src={thumbnailUrl || "/placeholder.jpg"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
          alt={heading || url}
        />
      </div>
      <CardContent className="h-full flex flex-col px-4 md:px-5">
        <div className="flex-1">
          {heading && (
            <h3 className="text-lg tracking-tight font-bold mb-2 line-clamp-2">
              {heading}
            </h3>
          )}
          {paragraph && (
            <p className="text-sm text-muted-foreground line-clamp-5">
              {paragraph}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-6">
          {sourceName && <Badge variant="outline">{sourceName}</Badge>}
          <p className="text-sm text-muted-foreground">
            {format(createdAt, "yyyy-MM-dd")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
