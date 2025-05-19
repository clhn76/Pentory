import { Markdown } from "@/components/common/markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ContentData } from "../types";
import { AdsenseDisplayAd } from "@/modules/common/adsense/components/adsense-display-ad";

interface SummaryResultProps {
  summary: string;
  contentData?: ContentData;
  isLoading?: boolean;
}

export const SummaryResult = ({
  summary,
  contentData,
  isLoading = false,
}: SummaryResultProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      toast.success("요약이 클립보드에 복사되었습니다.");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("복사에 실패했습니다.");
    }
  };

  if (!summary && !isLoading) return null;

  return (
    <Card className="w-full mt-8">
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="relative w-full aspect-video">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {contentData?.thumbnailUrl && (
              <div className="relative w-full aspect-video mb-6">
                <Image
                  unoptimized
                  src={contentData.thumbnailUrl}
                  alt={contentData.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">요약</TabsTrigger>
                <TabsTrigger value="content">원본 콘텐츠</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <div className="relative">
                  <AdsenseDisplayAd className="mb-2" />

                  <div className="flex justify-end gap-2 mb-6">
                    {contentData?.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(contentData.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        원본 링크로 이동
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleCopySummary}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {isCopied ? "복사됨" : "복사"}
                    </Button>
                  </div>
                  <Markdown>{summary}</Markdown>
                  <AdsenseDisplayAd />
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-4">
                {contentData?.content ? (
                  <div className="prose prose-invert prose-sm max-w-none space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-primary border border-primary/20 px-2 py-1 rounded">
                          제목
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {contentData.title}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-primary border border-primary/20 px-2 py-1 rounded">
                          설명
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {contentData.description}
                      </p>
                    </div>

                    {contentData.keywords.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary border border-primary/20 px-2 py-1 rounded">
                            키워드
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contentData.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-primary border border-primary/20 px-2 py-1 rounded">
                          원본 콘텐츠
                        </span>
                      </div>
                      <div className="rounded-lg bg-secondary/30 p-4">
                        <div className="whitespace-pre-wrap text-foreground/90">
                          {contentData.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    원본 콘텐츠가 없습니다.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};
