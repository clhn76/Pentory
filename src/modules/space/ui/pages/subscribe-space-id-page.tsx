import { db } from "@/db";
import { spaceTable, spaceSubscriptionTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SpaceSummaries } from "../components/space-summaries";
import { BackButton } from "@/components/common/back-button";
import { SubscribeButton } from "../components/subscribe-button";
import { SpaceSourceDialog } from "../components/space-source-dialog";

interface SubscribeSpaceIdPageProps {
  params: Promise<{ spaceId: string }>;
}

export const SubscribeSpaceIdPage = async ({
  params,
}: SubscribeSpaceIdPageProps) => {
  const { spaceId } = await params;

  // 스페이스가 존재하는지 확인
  const space = await db.query.spaceTable.findFirst({
    where: eq(spaceTable.id, spaceId),
  });

  // 스페이스가 없는 경우 404
  if (!space) {
    notFound();
  }

  // 구독 중인 스페이스인지 확인
  const subscription = await db.query.spaceSubscriptionTable.findFirst({
    where: and(
      eq(spaceSubscriptionTable.spaceId, spaceId),
      eq(spaceSubscriptionTable.userId, space.userId)
    ),
  });

  // 구독 중이 아닌 경우 메시지 표시
  if (!subscription) {
    return (
      <div className="container">
        <div className="flex items-center gap-2 justify-between">
          <BackButton href="/dashboard/subscribe-spaces" />
        </div>
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">구독하지 않은 스페이스</h2>
          <p className="text-muted-foreground">
            해당 스페이스는 구독하지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center gap-2 justify-between">
        <BackButton href="/dashboard/subscribe-spaces" />
        <div className="flex items-center gap-2">
          <SubscribeButton spaceId={spaceId} spaceUserId={space.userId} />
          <SpaceSourceDialog spaceId={spaceId} />
        </div>
      </div>
      <SpaceSummaries spaceId={spaceId} />
    </div>
  );
};
