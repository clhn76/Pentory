import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, SettingsIcon } from "lucide-react";
import {
  SpaceSummaries,
  SpaceSummariesSkeleton,
} from "./_components/space-summaries";
import {
  SpaceSettings,
  SpaceSettingsSkeleton,
} from "./_components/space-settings";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface SpaceIdPageProps {
  params: Promise<{ spaceId: string }>;
}

const SpaceIdPage = async ({ params }: SpaceIdPageProps) => {
  const { spaceId } = await params;

  prefetch(trpc.spaceRouter.getSpaceById.queryOptions({ spaceId }));

  return (
    <HydrateClient>
      <div className="container">
        <Tabs defaultValue="contents" className="w-full">
          <TabsList>
            <TabsTrigger value="contents">
              <FileTextIcon className="size-4" />
              요약 콘텐츠
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="size-4" />
              설정
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contents">
            <Suspense fallback={<SpaceSummariesSkeleton />}>
              <SpaceSummaries spaceId={spaceId} />
            </Suspense>
          </TabsContent>
          <TabsContent value="settings">
            <Suspense fallback={<SpaceSettingsSkeleton />}>
              <SpaceSettings spaceId={spaceId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </HydrateClient>
  );
};

export default SpaceIdPage;
