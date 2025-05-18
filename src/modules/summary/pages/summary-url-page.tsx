"use client";

import { useCompletion } from "@ai-sdk/react";
import { SummaryResult } from "../components/summary-result";
import {
  SummaryUrlForm,
  SummaryUrlFormValues,
} from "../components/summary-url-form";
import { ContentData } from "../types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SummaryHistory } from "../components/summary-history";
import { useEffect, useState } from "react";

export const SummaryUrlPage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isFinished, setIsFinished] = useState(false);

  const saveSummary = useMutation(
    trpc.summaryRouter.saveSummary.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.summaryRouter.getUserSummaries.queryOptions()
        );
      },
    })
  );

  const { complete, completion, isLoading, data } = useCompletion({
    api: "/api/summary",
    onFinish: async () => {
      setIsFinished(true);
    },
  });

  const handleSubmit = async (values: SummaryUrlFormValues) => {
    await complete(values.url);
  };

  useEffect(() => {
    if (isFinished) {
      const lastData = data?.[data.length - 1] as unknown as ContentData;
      saveSummary.mutate({
        url: lastData.url,
        summary: completion,
        thumbnailUrl: lastData.thumbnailUrl,
      });
      setIsFinished(false);
    }
  }, [completion, data, isFinished, saveSummary]);

  return (
    <div className="container py-12 md:py-24 h-full flex flex-col items-center max-w-2xl">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">URL 요약</h1>
      <p className="text-center text-base md:text-lg text-muted-foreground mb-6 tracking-tight">
        유튜브, 블로그, 뉴스 등의 URL 주소만으로 콘텐츠의 핵심내용을 요약 정리해
        드립니다.
      </p>
      <SummaryUrlForm onSubmit={handleSubmit} disabled={isLoading} />
      <SummaryResult
        summary={completion}
        contentData={data?.[data.length - 1] as unknown as ContentData}
        isLoading={isLoading && !completion}
      />
      <SummaryHistory />
    </div>
  );
};
