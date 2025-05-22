"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SpaceSummaryContent } from "../components/space-summaries/space-summary-content";
import { SpaceSummarySkeleton } from "../components/space-summaries/space-summary-skeleton";
import { SPACE_HREF_PREFIX } from "../config";

export const SpaceSummarySharePage = () => {
  const trpc = useTRPC();
  const params = useParams<{ spaceSummaryId: string }>();

  const spaceSummary = useQuery(
    trpc.spaceRouter.getSpaceSummaryById.queryOptions({
      spaceSummaryId: params.spaceSummaryId,
    })
  );

  return (
    <div className="container mx-auto max-w-screen-md py-20 md:py-28">
      {spaceSummary.isPending ? (
        <SpaceSummarySkeleton />
      ) : (
        <article>
          <SpaceSummaryContent
            id={spaceSummary.data?.id || ""}
            thumbnailUrl={spaceSummary.data?.thumbnailUrl || ""}
            spaceSourceName={spaceSummary.data?.spaceSource?.name || ""}
            createdAt={spaceSummary.data?.createdAt || ""}
            content={spaceSummary.data?.content || ""}
            url={spaceSummary.data?.url || ""}
          />

          <div className="mt-8 flex items-center justify-center">
            <Link href={SPACE_HREF_PREFIX.PUBLIC}>
              <Button className="w-full rounded-full" size="lg">
                더 많은 요약 찾아보기
              </Button>
            </Link>
          </div>
        </article>
      )}
    </div>
  );
};
