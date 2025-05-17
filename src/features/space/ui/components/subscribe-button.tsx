"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";

interface SubscribeButtonProps {
  spaceId: string;
  spaceUserId: string;
}

export const SubscribeButton = ({
  spaceId,
  spaceUserId,
}: SubscribeButtonProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );
  const { data: isSubscribed, isLoading: isQueryLoading } = useQuery(
    trpc.spaceRouter.isSubscribed.queryOptions({ spaceId })
  );

  const subscribeMutation = useMutation(
    trpc.spaceRouter.subscribe.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
        });
        const previousData = queryClient.getQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId })
        );

        queryClient.setQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
          true
        );

        return { previousData };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
          context?.previousData
        );
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("구독 완료");
      },
    })
  );

  const unsubscribeMutation = useMutation(
    trpc.spaceRouter.unsubscribe.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
        });
        const previousData = queryClient.getQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId })
        );

        queryClient.setQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
          false
        );

        return { previousData };
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(
          trpc.spaceRouter.isSubscribed.queryKey({ spaceId }),
          context?.previousData
        );
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("구독 취소");
      },
    })
  );

  const handleSubscribe = useCallback(async () => {
    if (isQueryLoading) return;
    if (isSubscribed) {
      await unsubscribeMutation.mutateAsync({ spaceId });
    } else {
      await subscribeMutation.mutateAsync({ spaceId });
    }
  }, [
    isQueryLoading,
    isSubscribed,
    spaceId,
    subscribeMutation,
    unsubscribeMutation,
  ]);

  const debouncedHandleSubscribe = useMemo(
    () => debounce(handleSubscribe, 300),
    [handleSubscribe]
  );

  // 스페이스 소유자와 현재 사용자가 같은 경우 버튼을 표시하지 않음
  if (userInfo?.id === spaceUserId) {
    return null;
  }

  if (isQueryLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      onClick={debouncedHandleSubscribe}
    >
      {isSubscribed ? "구독 취소" : "구독하기"}
    </Button>
  );
};
