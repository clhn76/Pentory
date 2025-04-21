import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileTextIcon, SettingsIcon } from "lucide-react";
import { SpaceSettings } from "../components/space-settings";
import { SpaceSummaries } from "../components/space-summaries";

interface SpaceIdPageProps {
  params: Promise<{ spaceId: string }>;
}

export const SpaceIdPage = async ({ params }: SpaceIdPageProps) => {
  const { spaceId } = await params;

  return (
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
          <SpaceSummaries spaceId={spaceId} />
        </TabsContent>

        <TabsContent value="settings">
          <SpaceSettings spaceId={spaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
