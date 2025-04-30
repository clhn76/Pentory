import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export const FreePlanCard = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Free</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="text-4xl font-bold mb-6 text-card-foreground">무료</div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" /> 최대 1개의 요약 스페이스
          </li>
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" />
            스페이스당 최대 10개의 소스
          </li>
          <li className="flex items-center text-card-foreground">
            <CheckIcon className="size-5 mr-2" />
            공개 스페이스만 생성 가능
          </li>
        </ul>
        <Link href="/dashboard">
          <Button className="w-full" size="lg">
            무료로 시작하기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
