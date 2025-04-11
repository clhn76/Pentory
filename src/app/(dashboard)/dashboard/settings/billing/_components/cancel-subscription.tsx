"use client";

import { useGlobalAlertDialogStore } from "@/components/dialogs/global-alert-dialog/store";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserInfo } from "@/hooks/use-get-user-info";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const CancelSubscription = () => {
  const trpc = useTRPC();
  const userInfo = useGetUserInfo();
  const queryClient = useQueryClient();

  // Stores
  const { openDialog } = useGlobalAlertDialogStore();

  // Mutations
  const cancelSubscription = useMutation(
    trpc.subscriptionRouter.cancelSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("구독 취소가 예정되었습니다.");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("구독 취소중 오류가 발생했습니다.");
      },
    })
  );

  const activateSubscription = useMutation(
    trpc.subscriptionRouter.activateSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("구독 취소가 해제되었습니다.");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("구독 취소 해제중 오류가 발생했습니다.");
      },
    })
  );

  // Handlers
  const handleCancelClick = () => {
    if (userInfo.subscription?.status === "CANCEL_PENDING") {
      openDialog({
        content: <p>구독을 취소를 해제하시겠습니까?</p>,
        onConfirm: () => activateSubscription.mutate(),
      });
    } else {
      openDialog({
        content: <p>구독을 정말 취소하시겠습니까?</p>,
        onConfirm: () => cancelSubscription.mutate(),
      });
    }
  };

  if (
    userInfo.subscription?.status === "CANCELLED" ||
    userInfo.subscription?.status === "PAST_DUE"
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>취소</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">구독 취소</span>
        {userInfo.subscription?.status === "CANCEL_PENDING" ? (
          <Button
            onClick={handleCancelClick}
            isLoading={activateSubscription.isPending}
          >
            구독 취소 해제
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={handleCancelClick}
            isLoading={cancelSubscription.isPending}
          >
            구독 취소
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
