"use client";

import { useGlobalAlertDialogStore } from "@/features/dialog/stores/use-global-alert-dialog-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const SubscriptionInfo = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  const currentSubscription = userInfo?.subscription;
  const userPlan = userInfo?.subscription?.plan;

  // Stores
  const { openDialog } = useGlobalAlertDialogStore();

  // Mutations
  const cancelChangeSubscriptionMutation = useMutation(
    trpc.paymentRouter.cancelSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("플랜 변경이 취소되었습니다.");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("플랜 변경 취소에 실패했습니다.");
      },
    })
  );

  const handleCancelChangeSubscriptionClick = () => {
    openDialog({
      content: <p>플랜 변경을 취소하시겠습니까?</p>,
      onConfirm: () => {
        cancelChangeSubscriptionMutation.mutate();
      },
    });
  };

  if (!currentSubscription)
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <InfoIcon className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">구독 정보가 없습니다</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              아직 구독 중인 플랜이 없습니다. 플랜을 구독하여 서비스를
              이용해보세요.
            </p>
            <Link href="/dashboard/plans">
              <Button>플랜 구독하기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{userPlan?.name}</CardTitle>
          <CardDescription>
            {userInfo.name}님, {userPlan?.name} 플랜을 이용해 주셔서 감사합니다.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          {currentSubscription.status === "CHANGE_PENDING" && (
            <Button
              variant="outline"
              onClick={handleCancelChangeSubscriptionClick}
              isLoading={cancelChangeSubscriptionMutation.isPending}
            >
              플랜 변경 취소
            </Button>
          )}
          <Link href="/dashboard/plans">
            <Button
              variant="outline"
              disabled={cancelChangeSubscriptionMutation.isPending}
            >
              플랜 변경
            </Button>
          </Link>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm">플랜 정보</p>
            <p className="font-bold">{userPlan?.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">결제 주기</p>
            <p className="font-bold">
              {userPlan?.billingCycle === "MONTH" ? "월간 결제" : "연간 결제"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              {currentSubscription.status === "CANCEL_PENDING"
                ? "구독 만료일"
                : "다음 결제일"}
            </p>
            <p className="font-bold">
              {format(currentSubscription.endAt, "yyyy-MM-dd")}
            </p>
          </div>
        </div>
        {currentSubscription.status === "CHANGE_PENDING" && (
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>플랜 변경 예정됨</AlertTitle>
            <AlertDescription>
              다음 결제일 이후에 현재 플랜이 변경됩니다.
            </AlertDescription>
          </Alert>
        )}
        {currentSubscription.status === "CANCEL_PENDING" && (
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>구독 취소 예정됨</AlertTitle>
            <AlertDescription>
              구독 만료일 이후에 현재 플랜을 더 이상 사용할 수 없습니다.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
