"use client";

import { useCompletion } from "@ai-sdk/react";
import { ContentFormData } from "../types";
import { useEffect, useState } from "react";
import { Markdown } from "@/components/common/markdown";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

interface ContentEditorProps {
  contentFormData: ContentFormData;
}

export const ContentEditor = ({ contentFormData }: ContentEditorProps) => {
  const trpc = useTRPC();

  const [markdown, setMarkdown] = useState("");

  const generateImages = useMutation(
    trpc.contentRouter.generateImages.mutationOptions({
      onSuccess: (images) => {
        const currentMarkdown = markdown || completion;
        let updatedMarkdown = currentMarkdown;
        let imageIndex = 0;

        // 이미지 패턴을 찾아서 순서대로 교체
        updatedMarkdown = updatedMarkdown.replace(
          /!\[.*?\]\(\/placeholder\.jpg\)/g,
          (match) => {
            if (imageIndex < images.length) {
              const imageUrl = images[imageIndex];
              imageIndex++;
              return match.replace("/placeholder.jpg", imageUrl);
            }
            return match;
          }
        );

        setMarkdown(updatedMarkdown);
      },
    })
  );

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/content",
    onFinish: (_, completion) => {
      setMarkdown(completion);
      generateImages.mutate({
        content: completion,
      });
    },
  });

  useEffect(() => {
    complete(JSON.stringify(contentFormData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !completion) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Markdown>{markdown || completion}</Markdown>
    </Card>
  );
};
