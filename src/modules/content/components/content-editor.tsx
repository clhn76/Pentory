"use client";

import { Markdown } from "@/components/common/markdown";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { ContentFormData } from "../types";

interface ContentEditorProps {
  contentFormData: ContentFormData;
  onBack: () => void;
}

export const ContentEditor = ({
  contentFormData,
  onBack,
}: ContentEditorProps) => {
  const { completion, complete, isLoading, setCompletion } = useCompletion({
    api: "/api/content",
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      complete(JSON.stringify(contentFormData));
      isFirstRender.current = false;
    }
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
    <section className="space-y-2">
      <Button
        variant="outline"
        onClick={() => {
          setCompletion("");
          onBack();
        }}
      >
        <ArrowLeftIcon />
      </Button>
      <Card className="p-6">
        <Markdown>{completion}</Markdown>
      </Card>
    </section>
  );
};
