"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSpaceSummaryDialogStore } from "../../stores/use-space-summary-dialog-store";
import { SpaceSummaryContent } from "./space-summary-content";
import { SpaceSummarySkeleton } from "./space-summary-skeleton";

export const SpaceSummaryDialog = () => {
  const trpc = useTRPC();
  const isMobile = useIsMobile();

  const { isOpen, spaceSummaryId, closeDialog } = useSpaceSummaryDialogStore();

  const spaceSummary = useQuery(
    trpc.spaceRouter.getSpaceSummaryById.queryOptions(
      {
        spaceSummaryId: spaceSummaryId ?? "",
      },
      {
        enabled: isOpen && !!spaceSummaryId,
      }
    )
  );

  const renderContent = useCallback(
    () => (
      <>
        {spaceSummary.isPending ? (
          <SpaceSummarySkeleton />
        ) : (
          <SpaceSummaryContent
            id={spaceSummary.data?.id || ""}
            thumbnailUrl={spaceSummary.data?.thumbnailUrl || ""}
            spaceSourceName={spaceSummary.data?.spaceSource?.name || ""}
            createdAt={spaceSummary.data?.createdAt || ""}
            content={spaceSummary.data?.content || ""}
            url={spaceSummary.data?.url || ""}
          />
        )}
      </>
    ),
    [spaceSummary.data, spaceSummary.isPending]
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={closeDialog}>
        <DrawerContent className="px-4 pb-8 data-[vaul-drawer-direction=bottom]:max-h-[95vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle></DrawerTitle>
            <DrawerDescription className="sr-only"></DrawerDescription>
          </DrawerHeader>
          <div className="mt-4 h-[90dvh] overflow-y-auto">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="w-full sm:max-w-[860px] max-h-screen overflow-y-auto p-10 flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Article</DialogTitle>
          </DialogHeader>
          <div>{renderContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }
};
