import { TopContent } from "@/services/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopContentItemProps {
  content: TopContent;
  index: number;
  isSelected: boolean;
  onSelect: (url: string) => void;
  disabled: boolean;
}

export const TopContentItem = ({
  content,
  isSelected,
  onSelect,
  disabled,
  index,
}: TopContentItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onSelect(content.url);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer flex items-center gap-3 hover:bg-muted/50 w-full p-2 rounded-lg group relative",
        disabled && "pointer-events-none opacity-50"
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Select ${content.title}`}
    >
      <div onClick={(e) => e.stopPropagation()} className="pointer-events-none">
        <Checkbox checked={isSelected} disabled={disabled} />
      </div>
      <div className="relative aspect-video max-w-24 md:max-w-40 flex-1">
        <span className="absolute left-0.5 top-0.5 bg-background text-xs px-2 py-1 rounded-sm z-1 border border-border">
          {index + 1}
        </span>
        <Image
          fill
          unoptimized
          loading="lazy"
          src={content.thumbnailImage || "/public/placeholder.jpg"}
          onError={(e) => {
            e.currentTarget.src = "/public/placeholder.jpg";
          }}
          alt={content.title}
          className="object-cover rounded-md pointer-events-none"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden break-all">
        <h2 className="line-clamp-2 tracking-tight">{content.title}</h2>
        <p className="line-clamp-1 tracking-tight text-sm text-muted-foreground">
          {content.description}
        </p>

        <div className="mt-2 text-xs flex items-center gap-2 text-muted-foreground">
          {content.author.profileImage && (
            <div className="relative size-4 rounded-full overflow-hidden">
              <Image
                fill
                unoptimized
                src={content.author.profileImage}
                alt={content.author.name}
                className="object-cover"
              />
            </div>
          )}
          <span>{content.author.name}</span>
          <span>•</span>
          <span>{content.publishDate}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="hidden group-hover:flex absolute right-1"
        onClick={(e) => {
          e.stopPropagation();
          window.open(content.url, "_blank");
        }}
        aria-label="Open original content"
      >
        <ExternalLink className="size-4" />
      </Button>
    </div>
  );
};
