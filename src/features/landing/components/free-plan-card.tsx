import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

export const FreePlanCard = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Free</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-4xl font-bold mb-6 text-card-foreground">무료</div>
        <div className="space-y-4">
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
                    1개
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
                    10개
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
                    공개만
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-auto">
          <Link href="/dashboard">
            <Button className="w-full" size="lg" variant="secondary">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
