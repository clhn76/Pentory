"use client";

import { SummaryItem } from "@/components/summary/summary-item";
import { Card } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  SummaryUrlForm,
  SummaryUrlFormValues,
} from "../components/summary-url-form";

type Summary = {
  id: number;
  url: string;
  content: string | null;
  createdAt: string;
  thumbnailUrl: string | null;
  userId: string;
};

export const SummaryUrlPage = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const summaries = useQuery(
    trpc.summaryRouter.getUserSummaries.queryOptions()
  );

  const summaryUrl = useMutation(
    trpc.summaryRouter.createSummaryByUrl.mutationOptions({
      onSuccess: () => {
        toast.success("요약 완료");
        queryClient.invalidateQueries({
          queryKey: trpc.summaryRouter.getUserSummaries.infiniteQueryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "요약 요청에 실패했습니다.");
      },
    })
  );

  const handleSubmit = async (values: SummaryUrlFormValues) => {
    summaryUrl.mutate(values);
  };

  return (
    <div className="container py-12 md:py-24 h-full flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">URL 요약</h1>
      <p className="text-center text-base md:text-lg text-muted-foreground mb-6 tracking-tight">
        유튜브, 블로그, 뉴스 등의 URL 주소만으로 콘텐츠의 핵심내용을 요약 정리해
        드립니다.
      </p>
      <SummaryUrlForm onSubmit={handleSubmit} disabled={summaryUrl.isPending} />

      <div className="w-full max-w-lg mt-16 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="h-[2px] w-full bg-muted" />
            <h3 className="text-lg font-bold text-center text-muted-foreground whitespace-nowrap">
              요약 기록
            </h3>
            <div className="h-[2px] w-full bg-muted" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            최근 20개의 요약 기록이 저장됩니다.
          </p>
        </div>

        {summaryUrl.isPending && (
          <Card className="p-6 flex flex-col items-center gap-4">
            <div className="w-full space-y-4">
              <div className="h-6 bg-muted rounded-full animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded-full animate-pulse w-1/2" />
              <div className="h-4 bg-muted rounded-full animate-pulse w-2/3" />
            </div>
            <p className="text-sm text-muted-foreground">
              Pentory AI가 콘텐츠를 열심히 요약중이니 잠시만 기다려주세요...✨
            </p>
          </Card>
        )}

        <section className="space-y-4">
          {summaries.data?.items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              요약 기록이 없습니다.
            </p>
          ) : (
            summaries.data?.items.map((summary: Summary) => (
              <SummaryItem
                key={summary.id}
                createdAt={summary.createdAt}
                url={summary.url}
                content={summary.content}
                thumbnailUrl={summary.thumbnailUrl}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
};
