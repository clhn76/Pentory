"use client";

import { Markdown } from "@/components/common/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { SpaceSummarySkeleton } from "../components/space-summary-skeleton";

export const SpaceSummaryModalPage = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const isMobile = useIsMobile();
  const params = useParams<{ spaceSummaryId: string }>();

  const [isOpen, setIsOpen] = useState(true);

  const spaceSummary = useQuery(
    trpc.spaceRouter.getSpaceSummaryById.queryOptions(
      {
        spaceSummaryId: params.spaceSummaryId,
      },
      {
        enabled: !!params.spaceSummaryId,
      }
    )
  );

  const handleCopyContent = useCallback(async () => {
    if (!spaceSummary.data?.content) return;

    try {
      await navigator.clipboard.writeText(spaceSummary.data.content);
      toast.success("본문이 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("복사에 실패했습니다.");
    }
  }, [spaceSummary.data]);

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      router.back();
    }, 300);
  }, [router]);

  const renderContent = useCallback(
    () => (
      <>
        {spaceSummary.isPending ? (
          <SpaceSummarySkeleton />
        ) : (
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full relative aspect-video overflow-hidden rounded-lg">
              <Image
                unoptimized
                fill
                src={spaceSummary.data?.thumbnailUrl || "/placeholder.jpg"}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
                alt={`Thumbnail`}
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {spaceSummary.data?.spaceSource?.name && (
                <Badge variant="secondary">
                  {spaceSummary.data.spaceSource.name}
                </Badge>
              )}
              {spaceSummary.data?.createdAt && (
                <span className="text-sm text-muted-foreground">
                  {format(new Date(spaceSummary.data.createdAt), "PPP", {
                    locale: ko,
                  })}
                </span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyContent}
                  className="text-sm flex items-center gap-1 text-muted-foreground hover:text-primary"
                  aria-label="본문 복사하기"
                >
                  <Copy size={14} />
                  <span>복사하기</span>
                </Button>
                {spaceSummary.data?.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-sm flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <a
                      href={spaceSummary.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="원본 링크로 이동"
                    >
                      <ExternalLink size={14} />
                      <span>원본 링크</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Markdown>{spaceSummary.data?.content}</Markdown>
          </div>
        )}
      </>
    ),
    [handleCopyContent, spaceSummary.data, spaceSummary.isPending]
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleCloseDialog}>
        <DrawerContent className="px-4 pb-8 data-[vaul-drawer-direction=bottom]:max-h-[95vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription className="sr-only"></DrawerDescription>
          </DrawerHeader>
          <div className="mt-4 h-[90dvh] overflow-y-auto">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="w-full sm:max-w-[860px] max-h-screen overflow-y-auto p-10 flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Article</DialogTitle>
          </DialogHeader>
          <div>{renderContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }
};
