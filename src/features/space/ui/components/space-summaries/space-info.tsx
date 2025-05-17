import { LockIcon, GlobeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface SpaceInfoProps {
  name: string;
  description?: string | null;
  isPublic: boolean;
  summaryCount: number;
  sourceCount: number;
  user?: {
    name: string | null;
    image: string | null;
  } | null;
  isPersonal?: boolean;
}

export const SpaceInfo = ({
  name,
  description,
  isPublic,
  summaryCount,
  sourceCount,
  user,
  isPersonal = false,
}: SpaceInfoProps) => {
  return (
    <div className="space-y-4 px-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold truncate">{name}</h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        {isPersonal ? (
          <Badge
            variant={isPublic ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isPublic ? (
              <>
                <GlobeIcon className="w-3 h-3" />
                <span>공개</span>
              </>
            ) : (
              <>
                <LockIcon className="w-3 h-3" />
                <span>비공개</span>
              </>
            )}
          </Badge>
        ) : (
          user && (
            <div className="flex items-center gap-2">
              {user.image && (
                <Image
                  unoptimized
                  src={user.image}
                  alt={user.name || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              {user.name && (
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
              )}
            </div>
          )
        )}
        <div className="flex items-center gap-1">
          <span>요약</span>
          <Badge variant="secondary">{summaryCount}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <span>소스</span>
          <Badge variant="secondary">{sourceCount}</Badge>
        </div>
      </div>
    </div>
  );
};
