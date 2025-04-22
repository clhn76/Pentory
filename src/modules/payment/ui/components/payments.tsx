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
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { parseAsInteger, useQueryState } from "nuqs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const Payments = () => {
  const trpc = useTRPC();

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data: userPayments, isLoading } = useQuery(
    trpc.paymentRouter.getUserPayments.queryOptions({
      page,
    })
  );

  if (isLoading) {
    return <PaymentsSkeleton />;
  }

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
            {userPayments?.payments.map((payment) => (
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
          totalPages={userPayments?.pagination.totalPages ?? 0}
          currentPage={userPayments?.pagination.page ?? 0}
          onPageChange={(page) => setPage(page)}
        />
      </CardFooter>
    </Card>
  );
};

export const PaymentsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-10" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-14 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="opacity-50">
                <Skeleton className="h-4 w-4 mr-2" />
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: 5 }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink className={index === 1 ? "bg-muted" : ""}>
                  <Skeleton className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext className="opacity-50">
                <Skeleton className="h-4 w-4 ml-2" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};
