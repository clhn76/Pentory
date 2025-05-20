"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SpaceSourceType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Globe, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers";
import { AddSpaceSource } from "./add-space-source";
import { SpaceSourceItem } from "./space-source-item";
import { FREE_PLAN } from "@/modules/payment/config";
import { Switch } from "@/components/ui/switch";
import { useGetUserInfo } from "@/modules/user/hooks/use-get-user-info.hook";

const spaceFormSchema = z.object({
  name: z
    .string()
    .min(1, "스페이스 이름은 필수입니다.")
    .max(50, "스페이스 이름은 최대 50자입니다."),
  description: z.string().max(100, "스페이스 설명은 최대 100자입니다."),
  summaryStyle: z.enum(["DEFAULT", "CUSTOM"]),
  customPrompt: z.string(),
  isPublic: z.boolean(),
  sources: z.array(
    z.object({
      url: z.string(),
      type: z.enum(["YOUTUBE_CHANNEL", "RSS_FEED"]),
      name: z.string(),
      channelId: z.string().optional().nullable(),
    })
  ),
});

const summaryStyleOptions = [
  {
    value: "DEFAULT",
    label: "기본",
    description: "AI가 최적화된 방식으로 콘텐츠를 요약합니다.",
  },
  {
    value: "CUSTOM",
    label: "커스텀",
    description: "직접 작성한 프롬프트에 따라 콘텐츠를 요약합니다.",
  },
];

export type SpaceFormValues = z.infer<typeof spaceFormSchema>;

interface SpaceFormProps {
  space?: inferRouterOutputs<AppRouter>["spaceRouter"]["getSpaceSettingsById"];
}

export const SpaceForm = ({ space }: SpaceFormProps) => {
  const userInfo = useGetUserInfo();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const defaultValues: SpaceFormValues = useMemo(
    () => ({
      name: space?.name || "",
      description: space?.description || "",
      summaryStyle: space?.summaryStyle || "DEFAULT",
      customPrompt: space?.customPrompt || "",
      isPublic: space?.isPublic ?? true,
      sources: space?.sources
        ? space.sources.map((source) => ({
            url: source.url,
            type: source.type,
            name: source.name,
            channelId: source.channelId,
          }))
        : [],
    }),
    [space]
  );

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues,
  });

  const createSpace = useMutation(
    trpc.spaceRouter.createSpace.mutationOptions({
      onSuccess: (data) => {
        toast.success("스페이스 생성 완료");
        router.push(`/dashboard/spaces/${data.id}`);
        queryClient.invalidateQueries({
          queryKey: trpc.spaceRouter.getSpaces.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    })
  );

  const updateSpace = useMutation(
    trpc.spaceRouter.updateSpace.mutationOptions({
      onSuccess: () => {
        toast.success("수정사항 저장 완료");
        queryClient.invalidateQueries({
          queryKey: trpc.spaceRouter.getSpaces.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.spaceRouter.getSummariesBySpaceId.queryKey({
            spaceId: space?.id,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.spaceRouter.getSpaceSettingsById.queryKey({
            spaceId: space?.id,
          }),
        });
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onSubmit = async (values: SpaceFormValues) => {
    if (space) {
      await updateSpace.mutateAsync(
        {
          spaceId: space.id,
          name: values.name,
          description: values.description,
          summaryStyle: values.summaryStyle,
          customPrompt: values.customPrompt,
          isPublic: values.isPublic,
          sources: values.sources.map((source) => ({
            ...source,
            type: source.type as "YOUTUBE_CHANNEL" | "RSS_FEED",
          })),
        },
        {
          onSuccess: () => {
            form.reset(values);
          },
        }
      );
    } else {
      await createSpace.mutateAsync({
        name: values.name,
        description: values.description,
        summaryStyle: values.summaryStyle,
        customPrompt: values.customPrompt,
        isPublic: values.isPublic,
        sources: values.sources.map((source) => ({
          ...source,
          type: source.type as "YOUTUBE_CHANNEL" | "RSS_FEED",
        })),
      });
    }
  };

  const handleAddSource = useCallback(
    (source: SpaceFormValues["sources"][number]) => {
      form.setValue("sources", [source, ...form.getValues("sources")], {
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleRemoveSource = useCallback(
    (url: string) => {
      form.setValue(
        "sources",
        form.getValues("sources").filter((source) => source.url !== url),
        {
          shouldDirty: true,
        }
      );
    },
    [form]
  );

  const handleUpdateSourceName = useCallback(
    (url: string, newName: string) => {
      const sources = form.getValues("sources");
      const updatedSources = sources.map((source) => {
        if (source.url === url) {
          return {
            ...source,
            name: newName,
          };
        }
        return source;
      });

      form.setValue("sources", updatedSources, {
        shouldDirty: true,
      });
    },
    [form]
  );

  const handleSummaryStyleChange = (value: string) => {
    form.setValue("summaryStyle", value as "DEFAULT" | "CUSTOM", {
      shouldDirty: true,
    });
  };

  const sources = form.watch("sources");
  const summaryStyle = form.watch("summaryStyle");
  const maxSourceCount =
    userInfo?.subscription?.plan.features.maxSourceCount ||
    FREE_PLAN.maxSourceCount;
  const planName = userInfo?.subscription?.plan.name || FREE_PLAN.name;
  const isFreePlan =
    !userInfo?.subscription || userInfo?.subscription?.status === "CANCELLED";

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <h3 className="text-xl font-semibold tracking-tight">
                스페이스 정보
              </h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스페이스 이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="스페이스 이름을 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스페이스 설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="스페이스에 대한 설명을 입력하세요 (선택사항)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      스페이스의 용도나 목적을 설명해 주세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>요약 스타일</FormLabel>
                <FormDescription>
                  스페이스 내 콘텐츠의 기본 요약 스타일을 선택하세요.
                </FormDescription>

                <FormField
                  control={form.control}
                  name="summaryStyle"
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {summaryStyleOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "relative flex flex-col items-start rounded-md border-2 p-4 cursor-pointer hover:border-primary transition-colors",
                            field.value === option.value
                              ? "border-primary bg-primary/5"
                              : "border-muted"
                          )}
                          onClick={() => handleSummaryStyleChange(option.value)}
                        >
                          {field.value === option.value && (
                            <CheckIcon className="absolute top-3 right-3 h-4 w-4 text-primary" />
                          )}
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {option.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />

                {summaryStyle === "CUSTOM" && (
                  <FormField
                    control={form.control}
                    name="customPrompt"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormControl>
                          <Textarea
                            placeholder="원하는 요약 스타일을 자유롭게 작성하세요"
                            {...field}
                            className="min-h-[250px]"
                          />
                        </FormControl>
                        <FormDescription>
                          예: &quot;핵심 정보만 간략하게 요약해주세요&quot; 또는
                          &quot;질문과 답변 형식으로 정리해주세요&quot;
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FormLabel className="text-base">공개 설정</FormLabel>
                      {field.value ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <span>공개</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span>비공개</span>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      {isFreePlan
                        ? "무료 플랜에서는 공개 스페이스만 생성할 수 있습니다."
                        : field.value
                        ? "공개 스페이스는 공개 스페이스 패널을 통해 다른 사람이 구독할 수 있습니다."
                        : "비공개 스페이스는 개인 스페이스 패널을 통해 개인만 조회 가능합니다."}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFreePlan}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <AddSpaceSource
              sources={sources}
              onAddSource={handleAddSource}
              maxSourceCount={maxSourceCount}
            />

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {planName} 플랜 - 최대 요약 소스 ( {sources.length} /{" "}
                {maxSourceCount} )
              </p>

              <section className="space-y-4">
                {sources.map((source) => (
                  <SpaceSourceItem
                    key={source.url}
                    type={source.type as SpaceSourceType}
                    name={source.name}
                    url={source.url}
                    onRemove={() => handleRemoveSource(source.url)}
                    onNameChange={(newName) =>
                      handleUpdateSourceName(source.url, newName)
                    }
                  />
                ))}
              </section>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={createSpace.isPending || updateSpace.isPending}
                disabled={!form.formState.isDirty}
              >
                {space ? "수정사항 저장" : "스페이스 만들기"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
