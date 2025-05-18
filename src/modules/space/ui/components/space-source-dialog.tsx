"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { SpaceSourceItem } from "./space-form/space-source-item";

interface SpaceSourceDialogProps {
  spaceId: string;
}

export const SpaceSourceDialog = ({ spaceId }: SpaceSourceDialogProps) => {
  const trpc = useTRPC();
  const isMobile = useIsMobile();

  const { data: sources, isLoading } = useQuery(
    trpc.spaceRouter.getSpaceSources.queryOptions({
      spaceId,
    })
  );

  const renderContent = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">소스 목록</h3>
      {sources && sources.length > 0 ? (
        <div className="space-y-2.5">
          {sources.map((source) => (
            <SpaceSourceItem
              key={source.id}
              type={source.type}
              name={source.name}
              url={source.url}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">등록된 소스가 없습니다.</p>
      )}
    </div>
  );

  if (isLoading) {
    return <Skeleton className="h-10 w-24" />;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="gap-2">
            <InfoIcon className="h-4 w-4" />
            <span>소스 정보</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-8 data-[vaul-drawer-direction=bottom]:max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>스페이스 소스 정보</DrawerTitle>
          </DrawerHeader>
          <div className="mt-4 h-[90dvh] overflow-y-auto">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <InfoIcon className="h-4 w-4" />
          <span>소스 정보</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>스페이스 소스 정보</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
