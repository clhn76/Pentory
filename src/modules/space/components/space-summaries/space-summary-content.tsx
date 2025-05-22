import { Markdown } from "@/components/common/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CopyIcon, ExternalLinkIcon, Share2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { toast } from "sonner";
import { SPACE_HREF_PREFIX } from "../../config";

interface SpaceSummaryContentProps {
  id: string;
  thumbnailUrl: string;
  spaceSourceName: string;
  createdAt: string;
  content: string;
  url: string;
}

export const SpaceSummaryContent = ({
  id,
  thumbnailUrl,
  spaceSourceName,
  createdAt,
  content,
  url,
}: SpaceSummaryContentProps) => {
  const handleShareContent = useCallback(async () => {
    try {
      const shareUrl = `${window.location.origin}${SPACE_HREF_PREFIX.SHARE}/${id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("공유 링크가 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("공유에 실패했습니다.");
    }
  }, [id]);

  const handleCopyContent = useCallback(async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast.success("본문이 클립보드에 복사되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("복사에 실패했습니다.");
    }
  }, [content]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full relative aspect-video overflow-hidden rounded-lg">
        <Image
          unoptimized
          fill
          src={thumbnailUrl || "/placeholder.jpg"}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
          alt={`Thumbnail`}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {spaceSourceName && (
            <Badge variant="secondary">{spaceSourceName}</Badge>
          )}
          {createdAt && (
            <span className="text-sm text-muted-foreground">
              {format(new Date(createdAt), "yyyy.MM.dd", {
                locale: ko,
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyContent}
            aria-label="복사하기"
          >
            <CopyIcon size={14} />
            <span>복사하기</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareContent}
            aria-label="공유하기"
          >
            <Share2Icon size={14} />
            <span>공유하기</span>
          </Button>

          {url && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="원본 링크로 이동"
              >
                <ExternalLinkIcon size={14} />
                <span>원본 링크</span>
              </a>
            </Button>
          )}
        </div>
      </div>

      <Markdown>{content}</Markdown>
    </div>
  );
};
