import { db } from "@/db";
import { spaceTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { SpaceSummaries } from "../components/space-summaries";
import { BackButton } from "@/components/common/back-button";
import { SubscribeButton } from "../components/subscribe-button";
import { SpaceSourceDialog } from "../components/space-source-dialog";

interface PublicSpaceIdPageProps {
  params: Promise<{ spaceId: string }>;
}

export const PublicSpaceIdPage = async ({ params }: PublicSpaceIdPageProps) => {
  const { spaceId } = await params;

  // 공개 스페이스인지 확인
  const space = await db.query.spaceTable.findFirst({
    where: eq(spaceTable.id, spaceId),
  });

  // 스페이스가 없는 경우 404
  if (!space) {
    notFound();
  }

  // 비공개 스페이스인 경우 메시지 표시
  if (!space.isPublic) {
    return (
      <div className="container">
        <div className="flex items-center gap-2 justify-between">
          <BackButton href="/dashboard/public-spaces" />
        </div>
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">비공개 스페이스</h2>
          <p className="text-muted-foreground">
            해당 스페이스는 비공개로 설정되어 있어 접근할 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex items-center gap-2 justify-between">
        <BackButton href="/dashboard/public-spaces" />
        <div className="flex items-center gap-2">
          <SubscribeButton spaceId={spaceId} spaceUserId={space.userId} />
          <SpaceSourceDialog spaceId={spaceId} />
        </div>
      </div>
      <SpaceSummaries spaceId={spaceId} />
    </div>
  );
};
