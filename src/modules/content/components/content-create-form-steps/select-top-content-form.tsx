import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { FormStepProps } from "@/modules/common/form-steps/types";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TopContent } from "@/services/html-parsing-service";
import Image from "next/image";

const selectTopContentSchema = z.object({
  referenceUrls: z.array(z.string()),
});

export const SelectTopContentForm = ({
  onNext,
  onBack,
  initialData,
  formData,
}: FormStepProps<{
  referenceUrls: string[];
}>) => {
  const trpc = useTRPC();
  const keyword = formData["keyword-form"].keyword;
  const [selectedContents, setSelectedContents] = useState<TopContent[]>([]);

  const formRef = useSlideInAnimation<HTMLFormElement>(".form-item", {
    duration: 0.5,
    stagger: 0.1,
    xOffset: 100,
    ease: "power2.out",
  });

  const naverBlogTopContents = useQuery({
    ...trpc.contentRouter.searchTopContents.queryOptions({
      keyword,
    }),
    enabled: !!keyword,
  });

  const form = useForm<{
    referenceUrls: string[];
  }>({
    resolver: zodResolver(selectTopContentSchema),
    defaultValues: {
      referenceUrls: initialData?.referenceUrls || [],
    },
  });

  const handleContentSelect = (content: TopContent) => {
    setSelectedContents((prev) => {
      const isSelected = prev.some((item) => item.title === content.title);
      if (isSelected) {
        return prev.filter((item) => item.title !== content.title);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, content];
    });
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
        {naverBlogTopContents.data?.topContents && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">네이버 블로그 상위 콘텐츠</h3>
            <p className="text-sm text-muted-foreground">
              최대 3개까지 선택 가능합니다. (현재 {selectedContents.length}개
              선택됨)
            </p>
            <div className="grid gap-4">
              {naverBlogTopContents.data.topContents.map(
                (content: TopContent, index: number) => (
                  <Card key={content.title} className="form-item">
                    <CardHeader className="flex flex-row items-start space-x-4">
                      <div className="flex items-center space-x-4">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </span>
                        <Checkbox
                          checked={selectedContents.some(
                            (item) => item.title === content.title
                          )}
                          onCheckedChange={() => handleContentSelect(content)}
                          disabled={
                            selectedContents.length >= 3 &&
                            !selectedContents.some(
                              (item) => item.title === content.title
                            )
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {content.title}
                        </CardTitle>
                        <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{content.author.name}</span>
                          <span>•</span>
                          <span>{content.publishDate}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        {content.thumbnailImage && (
                          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              fill
                              unoptimized
                              src={content.thumbnailImage}
                              alt={content.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {content.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button type="submit" disabled={form.formState.isValid === false}>
            다음
          </Button>
        </div>
      </form>
    </Form>
  );
};
