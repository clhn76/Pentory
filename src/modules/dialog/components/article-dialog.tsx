"use client";

import { Markdown } from "@/components/common/markdown";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useArticleDialogStore } from "../stores/use-article-dialog-store";
import DisplayAd from "@/features/ads/components/display-ad";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const ArticleDialog = () => {
  const isMobile = useIsMobile();
  const { isOpen, closeDialog, articleData } = useArticleDialogStore();

  // 마우스 뒤로가기 버튼 처리
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      closeDialog();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, closeDialog]);

  const handleCopyContent = useCallback(async () => {
    if (!articleData?.content) return;

    try {
      await navigator.clipboard.writeText(articleData.content);
      toast.success("본문이 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("복사에 실패했습니다.");
    }
  }, [articleData?.content]);

  const renderContent = useCallback(
    () => (
      <div className="flex flex-col gap-6 w-full">
        <div className="w-full relative aspect-video overflow-hidden rounded-lg">
          <Image
            unoptimized
            fill
            src={articleData?.thumbnailUrl || "/placeholder.jpg"}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
            alt={`Thumbnail`}
            className="object-cover"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {articleData?.source?.name && (
            <Badge variant="secondary">{articleData.source.name}</Badge>
          )}
          {articleData?.createdAt && (
            <span className="text-sm text-muted-foreground">
              {format(new Date(articleData.createdAt), "PPP", { locale: ko })}
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
            {articleData?.source?.url && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-sm flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                <a
                  href={articleData.source.url}
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
        <DisplayAd className="h-[90px]" />

        <Markdown>{articleData?.content}</Markdown>

        <DisplayAd className="h-[90px]" />
      </div>
    ),
    [articleData, handleCopyContent]
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeDialog}>
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
      <Dialog open={isOpen} onOpenChange={closeDialog}>
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
