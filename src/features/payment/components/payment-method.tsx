"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import PortOne from "@portone/browser-sdk/v2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

export const PaymentMethod = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery(
    trpc.userRouter.getUserInfo.queryOptions()
  );

  const paymentMethod = userInfo?.paymentMethod;

  const changePaymentMethod = useMutation(
    trpc.paymentRouter.upsertPaymentMethod.mutationOptions({
      onSuccess: () => {
        toast.success("결제 수단 변경 완료");
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserInfo.queryKey(),
        });
      },
      onError: () => {
        toast.error("결제 수단 변경 중 오류가 발생했습니다.");
      },
    })
  );

  if (!paymentMethod) return null;

  const handleChangePaymentMethod = async () => {
    // 신규 빌링키 발급
    const response = await PortOne.requestIssueBillingKey({
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
      channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
      billingKeyMethod: "CARD",
    });

    // 결제 수단 발급 실패
    if (response?.code) {
      return;
    }

    const billingKey = response?.billingKey;

    if (!billingKey) {
      alert("결제 수단 발급에 실패했습니다.");
      return;
    }

    // 결제 수단 변경
    await changePaymentMethod.mutateAsync({
      newBillingKey: billingKey,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 수단</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-sm">
          등록 일:{" "}
          <span className="text-base font-semibold">
            {format(paymentMethod.updatedAt, "yyyy-MM-dd")}
          </span>
        </p>
        <Button
          variant="outline"
          onClick={handleChangePaymentMethod}
          isLoading={changePaymentMethod.isPending}
        >
          결제 수단 변경
        </Button>
      </CardContent>
    </Card>
  );
};
