import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, SettingsIcon } from "lucide-react";
import { SpaceSettings } from "../components/space-settings";
import { SpaceSummaries } from "../components/space-summaries";
import { BackButton } from "@/components/common/back-button";
import { SPACE_HREF_PREFIX } from "../config";

interface SpaceIdPageProps {
  params: Promise<{ spaceId: string }>;
}

export const SpaceIdPage = async ({ params }: SpaceIdPageProps) => {
  const { spaceId } = await params;

  return (
    <div className="container">
      <Tabs defaultValue="contents" className="w-full">
        <div className="flex items-center gap-2 justify-between">
          <BackButton href={SPACE_HREF_PREFIX.MY} />

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
        </div>

        <TabsContent value="contents">
          <SpaceSummaries spaceId={spaceId} isPersonal />
        </TabsContent>

        <TabsContent value="settings">
          <SpaceSettings spaceId={spaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
