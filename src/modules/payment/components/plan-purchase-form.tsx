"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkout } from "@/modules/toss-payments/components/checkout";
import { useGetUserInfo } from "@/modules/user/hooks/use-get-user-info.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type PlanBillingCycle = "MONTH" | "YEAR";

type Plan = {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  billingCycle: PlanBillingCycle;
  createdAt: Date;
  features: {
    maxSpaceCount: number;
    maxSourceCount: number;
  };
  tier: number;
  isDisplay: boolean;
  isPopular: boolean;
};

type PlanPurchaseFormProps = {
  plans: Plan[];
};

const formSchema = z.object({
  planId: z.string({
    required_error: "플랜을 선택해주세요",
  }),
  quantity: z.number().min(1, "최소 1개 이상 선택해주세요"),
});

export const PlanPurchaseForm = ({ plans }: PlanPurchaseFormProps) => {
  const userInfo = useGetUserInfo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planId: plans[0]?.id || "",
      quantity: 1,
    },
  });

  const selectedPlan = plans.find((plan) => plan.id === form.watch("planId"));
  const purchaseType = selectedPlan?.billingCycle || "MONTH";
  const quantity = form.watch("quantity");
  const totalAmount = selectedPlan ? selectedPlan.price * quantity : 0;

  const calculateExpiryDate = () => {
    const today = new Date();
    const months = purchaseType === "YEAR" ? quantity * 12 : quantity;
    const expiryDate = new Date(today.setMonth(today.getMonth() + months));
    return expiryDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePurchase = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // 구매 로직 구현
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePurchase)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">플랜 선택</h3>
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const plan = plans.find((p) => p.id === value);
                    if (plan) {
                      form.setValue("quantity", 1);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="플랜을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} (
                        {plan.billingCycle === "MONTH" ? "월간" : "연간"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">구매 수량</h3>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        field.onChange(Math.max(1, field.value - 1))
                      }
                    >
                      -
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-20 text-center"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => field.onChange(field.value + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-muted-foreground">
                    {purchaseType === "YEAR" ? "년" : "개월"}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">이용 기간</span>
            <span className="font-medium">
              {purchaseType === "YEAR" ? `${quantity}년` : `${quantity}개월`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">만료일</span>
            <span className="font-medium">{calculateExpiryDate()}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">총 결제 금액</span>
            <span className="text-2xl font-bold text-primary">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* <Button type="submit" className="w-full" size="lg">
          구매하기
        </Button> */}

        <Checkout
          amount={totalAmount}
          orderName={`${selectedPlan?.name} 구매`}
          userName={userInfo?.name || ""}
          userEmail={userInfo?.email || ""}
          userId={userInfo?.id || ""}
        />
      </form>
    </Form>
  );
};
