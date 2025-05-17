import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface PaymentRequestData {
  orderId: string | null;
  amount: string | null;
  paymentKey: string | null;
}

export function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  const [isLoading, setIsLoading] = useState(true);

  const confirmPayment = useMutation(
    trpc.tossPaymentsRouter.confirmPayment.mutationOptions({
      onError: (error) => {
        router.push(
          `/payments/fail?message=${error.message}&code=${error.data?.code}`
        );
      },
      onSettled: () => {
        setIsLoading(false);
      },
    })
  );

  useEffect(() => {
    const requestData: PaymentRequestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    if (
      !requestData.orderId ||
      !requestData.amount ||
      !requestData.paymentKey
    ) {
      router.push("/payments/fail");
      return;
    }

    confirmPayment.mutate({
      orderId: requestData.orderId,
      amount: Number(requestData.amount),
      paymentKey: requestData.paymentKey,
    });
  }, [router, searchParams, confirmPayment]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-card-foreground">
          결제가 완료되었습니다
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">주문번호</span>
            <span className="font-medium">{searchParams.get("orderId")}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">결제 금액</span>
            <span className="font-medium">
              {Number(searchParams.get("amount")).toLocaleString()}원
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">결제 키</span>
            <span className="font-medium break-all text-right">
              {searchParams.get("paymentKey")}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          aria-label="홈으로 돌아가기"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
