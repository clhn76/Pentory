"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CheckCircleIcon } from "lucide-react";

type PlanBillingCycle = "MONTH" | "YEAR";
type PlanFeatures = {
  maxSpaceCount: number;
  maxSourceCount: number;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  billingCycle: PlanBillingCycle;
  createdAt: Date;
  features: PlanFeatures;
  tier: number;
  isDisplay: boolean;
  isPopular: boolean;
};

type PlanDisplayCardProps = {
  planName: string;
  monthlyPlan: Plan;
  yearlyPlan: Plan;
};

export const PlanDisplayCard = ({
  planName,
  monthlyPlan,
  yearlyPlan,
}: PlanDisplayCardProps) => {
  const yearlyDiscount = yearlyPlan.discount || 0;
  const yearlySavings = monthlyPlan.price * 12 - yearlyPlan.price * 12;

  return (
    <Card
      className={`p-6 relative ${
        monthlyPlan.isPopular ? "border-2 border-primary" : ""
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">{planName}</h3>
            {monthlyPlan.isPopular && (
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  인기
                </span>
                <span className="text-sm text-muted-foreground">
                  가장 많은 사용자가 선택한 플랜
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          {/* 월간 플랜 */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-lg">월간</span>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {monthlyPlan.price.toLocaleString()}원
                  <span className="text-sm font-normal text-muted-foreground">
                    /월
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  연 {monthlyPlan.price * 12}원
                </div>
              </div>
            </div>
          </div>

          {/* 연간 플랜 */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-lg">연간</span>
                {yearlyDiscount > 0 && (
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {yearlyDiscount}% 할인
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">
                  {yearlyPlan.price.toLocaleString()}원
                  <span className="text-sm font-normal text-muted-foreground">
                    /연
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  월 {(yearlyPlan.price / 12).toLocaleString()}원
                </div>
              </div>
            </div>
            {yearlySavings > 0 && (
              <div className="text-sm text-primary font-medium">
                연간 {yearlySavings.toLocaleString()}원 절약
              </div>
            )}
          </div>
        </div>
        {/* modules 표 */}
        <Table>
          <TableBody>
            <TableRow className="border-b border-border/50">
              <TableCell className="text-left py-4">
                <span className="text-base font-medium text-foreground">
                  최대 요약 스페이스
                </span>
              </TableCell>
              <TableCell className="text-right py-4">
                <span className="text-base font-semibold text-primary">
                  {monthlyPlan.features.maxSpaceCount}개
                </span>
              </TableCell>
            </TableRow>
            <TableRow className="border-b border-border/50">
              <TableCell className="text-left py-4">
                <span className="text-base font-medium text-foreground">
                  스페이스당 최대 소스
                </span>
              </TableCell>
              <TableCell className="text-right py-4">
                <span className="text-base font-semibold text-primary">
                  {monthlyPlan.features.maxSourceCount}개
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-left py-4">
                <span className="text-base font-medium text-foreground">
                  스페이스 공개 설정
                </span>
              </TableCell>
              <TableCell className="text-right py-4">
                <span className="text-base font-semibold text-primary">
                  공개/비공개
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex items-center gap-2 px-1">
          <CheckCircleIcon className="size-5 text-primary" />
          <span className="text-base font-medium text-foreground">
            모든 광고 제거
          </span>
        </div>
      </div>
    </Card>
  );
};
