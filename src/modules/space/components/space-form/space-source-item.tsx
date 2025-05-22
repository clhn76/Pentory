import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpaceSourceType } from "@/db/schema";
import { CheckIcon, EditIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface SpaceSourceItemProps {
  type: SpaceSourceType;
  name: string;
  url: string;
  onRemove?: () => void;
  onNameChange?: (newName: string) => void;
}

export const SpaceSourceItem = ({
  type,
  name,
  url,
  onRemove,
  onNameChange,
}: SpaceSourceItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleSave = () => {
    if (editedName.trim() !== "" && onNameChange) {
      onNameChange(editedName);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <div className="relative space-y-1 bg-muted/50 rounded-lg px-4 py-3 w-full">
      {onRemove && (
        <Button
          onClick={onRemove}
          type="button"
          variant="outline"
          size="icon"
          className="absolute rounded-full top-0 right-0 -translate-y-1/2 translate-x-1/2 size-7 dark:bg-muted"
        >
          <XIcon />
        </Button>
      )}

      <div className="flex items-center gap-2 justify-between">
        {isEditing ? (
          <div className="flex gap-2 items-center flex-1">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-8 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                onClick={handleSave}
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <CheckIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={handleCancel}
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <XIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium line-clamp-1">{name}</p>
            {onNameChange && (
              <Button
                onClick={() => setIsEditing(true)}
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <EditIcon className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}

        <Badge variant="outline">
          {type === "YOUTUBE_CHANNEL" ? "Youtube Channel" : "RSS Feed"}
        </Badge>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-muted-foreground text-sm line-clamp-2 break-all overflow-hidden text-ellipsis"
        tabIndex={0}
        aria-label={`${name}의 ${
          type === "YOUTUBE_CHANNEL" ? "유튜브 채널" : "RSS 피드"
        } 링크 열기`}
      >
        {url}
      </a>
    </div>
  );
};
