import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpaceSourceType } from "@/db/schema";
import { XIcon } from "lucide-react";

interface SpaceSourceItemProps {
  type: SpaceSourceType;
  name: string;
  url: string;
  onRemove: () => void;
}

export const SpaceSourceItem = ({
  type,
  name,
  url,
  onRemove,
}: SpaceSourceItemProps) => {
  return (
    <div className="relative space-y-1 bg-muted/50 rounded-lg px-4 py-3">
      <Button
        onClick={onRemove}
        type="button"
        variant="outline"
        size="icon"
        className="absolute rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 size-7 dark:bg-muted"
      >
        <XIcon />
      </Button>

      <div className="flex items-center gap-2 justify-between">
        <p className="text-sm font-medium">{name}</p>

        <Badge variant="outline">
          {type === "YOUTUBE_CHANNEL" ? "Youtube Channel" : "RSS Feed"}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{url}</p>
    </div>
  );
};
