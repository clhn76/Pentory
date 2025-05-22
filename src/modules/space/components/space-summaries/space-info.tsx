import { LockIcon, GlobeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface SpaceInfoProps {
  isPersonal?: boolean;
}

export const SpaceInfo = ({ isPersonal = false }: SpaceInfoProps) => {
  const params = useParams<{ spaceId: string }>();
  const trpc = useTRPC();

  const spaceInfo = useQuery(
    trpc.spaceRouter.getSpaceInfoById.queryOptions(
      {
        spaceId: params.spaceId,
      },
      {
        enabled: !!params.spaceId,
      }
    )
  );

  return (
    <div className="space-y-4 px-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold truncate">
            {spaceInfo.data?.name}
          </h1>
        </div>
        {spaceInfo.data?.description && (
          <p className="text-sm text-muted-foreground">
            {spaceInfo.data?.description}
          </p>
        )}
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        {isPersonal ? (
          <Badge
            variant={spaceInfo.data?.isPublic ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {spaceInfo.data?.isPublic ? (
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
          spaceInfo.data?.user && (
            <div className="flex items-center gap-2">
              {spaceInfo.data?.user.image && (
                <Image
                  unoptimized
                  src={spaceInfo.data?.user.image}
                  alt={spaceInfo.data?.user.name || "User"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              {spaceInfo.data?.user.name && (
                <span className="text-sm text-muted-foreground">
                  {spaceInfo.data?.user.name}
                </span>
              )}
            </div>
          )
        )}
        <div className="flex items-center gap-1">
          <span>요약</span>
          <Badge variant="secondary">{spaceInfo.data?.summaryCount}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <span>소스</span>
          <Badge variant="secondary">{spaceInfo.data?.sourceCount}</Badge>
        </div>
      </div>
    </div>
  );
};
