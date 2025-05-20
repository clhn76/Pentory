import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormStepProps } from "@/modules/common/form-steps/types";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import { TopContent } from "@/services/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TopContentItem } from "../top-content-item";
import { TopContentSkeleton } from "../top-content-skeleton";
import { DASHBOARD_HEADER_HEIGHT } from "@/modules/dashboard/config";
import { Badge } from "@/components/ui/badge";

const topContentFormSchema = z.object({
  referenceUrls: z.array(z.string()).min(1, "최소 1개 이상 선택해주세요"),
});

export type TopContentFormData = z.infer<typeof topContentFormSchema>;

export const TopContentForm = ({
  onNext,
  onBack,
  initialData,
  formData,
}: FormStepProps<{
  referenceUrls: string[];
}>) => {
  const trpc = useTRPC();
  const keyword = formData["keyword"].keyword;
  const [activeTab, setActiveTab] = useState("naver");

  const formRef = useSlideInAnimation<HTMLFormElement>(".form-item", {
    duration: 0.5,
    stagger: 0.1,
    xOffset: 100,
    ease: "power2.out",
  });

  const { data: naverTopContents, isLoading: isNaverLoading } = useQuery({
    ...trpc.contentRouter.searchNaverTopContents.queryOptions({
      keyword,
    }),
    enabled: !!keyword,
    staleTime: Infinity,
  });

  const { data: youtubeTopContents, isLoading: isYoutubeLoading } = useQuery({
    ...trpc.contentRouter.searchYoutubeTopContents.queryOptions({
      keyword,
    }),
    enabled: !!keyword && !!naverTopContents,
    staleTime: Infinity,
  });

  const form = useForm<{
    referenceUrls: string[];
  }>({
    resolver: zodResolver(topContentFormSchema),
    defaultValues: {
      referenceUrls: initialData?.referenceUrls || [],
    },
  });

  const referenceUrls = form.watch("referenceUrls");

  const handleContentSelect = (selectedUrl: string) => {
    form.clearErrors();
    const isSelected = referenceUrls.includes(selectedUrl);
    if (isSelected) {
      form.setValue(
        "referenceUrls",
        referenceUrls.filter((url) => url !== selectedUrl)
      );
      return;
    }
    if (referenceUrls.length >= 3) {
      return;
    } else {
      form.setValue("referenceUrls", [...referenceUrls, selectedUrl]);
    }
  };

  const handleSubmit = (data: { referenceUrls: string[] }) => {
    onNext({ ...data });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            참고할 콘텐츠를 선택해주세요 (최대 3개)
          </h2>
          <div className="flex justify-center items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              검색 키워드
            </span>
            <Badge>{formData["keyword"].keyword}</Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              style={{
                top: DASHBOARD_HEADER_HEIGHT,
              }}
              className={`sticky z-20 grid w-full grid-cols-2`}
            >
              <TabsTrigger value="naver">네이버 블로그 TOP 15</TabsTrigger>
              <TabsTrigger value="youtube">유튜브 TOP 15</TabsTrigger>
            </TabsList>

            <TabsContent value="naver" className="space-y-4">
              {isNaverLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TopContentSkeleton key={`naver-skeleton-${index}`} />
                  ))
                : naverTopContents?.map(
                    (content: TopContent, index: number) => (
                      <TopContentItem
                        key={`naver-${content.title}`}
                        content={content}
                        index={index}
                        isSelected={referenceUrls.some(
                          (url) => url === content.url
                        )}
                        onSelect={handleContentSelect}
                        disabled={
                          referenceUrls.length >= 3 &&
                          !referenceUrls.some((url) => url === content.url)
                        }
                      />
                    )
                  )}
            </TabsContent>

            <TabsContent value="youtube" className="space-y-4">
              {isYoutubeLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <TopContentSkeleton key={`youtube-skeleton-${index}`} />
                  ))
                : youtubeTopContents?.map(
                    (content: TopContent, index: number) => (
                      <TopContentItem
                        key={`youtube-${content.title}`}
                        content={content}
                        index={index}
                        isSelected={referenceUrls.some(
                          (url) => url === content.url
                        )}
                        onSelect={handleContentSelect}
                        disabled={
                          referenceUrls.length >= 3 &&
                          !referenceUrls.some((url) => url === content.url)
                        }
                      />
                    )
                  )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-center">
          {referenceUrls.length > 0 && (
            <Badge variant="secondary">{referenceUrls.length}개 선택됨</Badge>
          )}
          {form.formState.errors.referenceUrls && (
            <FormMessage>
              <Badge variant="destructive">
                {form.formState.errors.referenceUrls?.message}
              </Badge>
            </FormMessage>
          )}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button type="submit">다음</Button>
        </div>
      </form>
    </Form>
  );
};
