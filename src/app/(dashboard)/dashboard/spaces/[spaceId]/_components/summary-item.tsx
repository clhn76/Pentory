"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SummaryItemProps {
  id: string;
  createdAt: string;
  url: string;
  content: string | null;
  thumbnailUrl: string | null;
  sourceName: string;
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

  return (
    <Card className="pt-0 overflow-clip">
      <div className="relative w-full aspect-video">
        <Image
          fill
          unoptimized
          src={thumbnailUrl || "/placeholder.jpg"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
          alt={heading || url}
          className="w-full object-cover"
        />
      </div>
      <CardContent className="prose prose-invert prose-sm">
        {heading && <h3 className="font-bold mb-2 line-clamp-2">{heading}</h3>}
        {paragraph && <p className="line-clamp-4">{paragraph}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant="outline">{sourceName}</Badge>
        <p className="text-sm text-muted-foreground">
          {format(createdAt, "yyyy-MM-dd")}
        </p>
      </CardFooter>
    </Card>
  );
};
