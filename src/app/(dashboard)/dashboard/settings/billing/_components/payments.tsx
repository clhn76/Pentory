"use client";

import { CommonPagination } from "@/components/common/common-pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "nuqs";

export const Payments = () => {
  const trpc = useTRPC();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const {
    data: { payments, pagination },
  } = useSuspenseQuery(
    trpc.subscriptionRouter.getUserPayments.queryOptions({
      page,
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 내역</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {format(payment.createdAt, "yyyy-MM-dd")}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.status === "SUBSCRIBE_PAID"
                    ? "결제 완료"
                    : payment.status === "UPGRADE_PAID"
                    ? "업그레이드 결제 완료"
                    : "결제 실패"}
                </TableCell>
                <TableCell className="text-right">
                  ₩ {payment.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter>
        <CommonPagination
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={(page) => setPage(page)}
        />
      </CardFooter>
    </Card>
  );
};

export const PaymentsSkeleton = () => {
  return <Skeleton className="h-[150px] rounded-xl" />;
};
