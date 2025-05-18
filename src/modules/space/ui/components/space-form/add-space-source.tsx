import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpaceFormValues } from "@/modules/space/ui/components/space-form";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface AddSpaceSourceProps {
  sources: SpaceFormValues["sources"];
  maxSourceCount: number;
  onAddSource: (source: SpaceFormValues["sources"][number]) => void;
}

export const AddSpaceSource = ({
  sources,
  maxSourceCount,
  onAddSource,
}: AddSpaceSourceProps) => {
  const trpc = useTRPC();

  // Mutation
  const { mutateAsync: validateSourceUrl, isPending } = useMutation(
    trpc.spaceRouter.validateSourceUrl.mutationOptions({
      onSuccess: (data) => {
        onAddSource(data);
        setSourceUrl("");
      },
      onError: (error) => {
        switch (error.data?.code) {
          case "BAD_REQUEST":
            toast.error("유효한 소스가 아닙니다.");
            break;
          case "NOT_FOUND":
            toast.error("존재하지 않는 소스입니다.");
            break;
          case "FORBIDDEN":
            toast.error("해당 소스는 외부 접근이 차단되어있습니다.");
            break;
          default:
            toast.error("소스 추가 오류");
            break;
        }
      },
    })
  );

  // State
  const [sourceUrl, setSourceUrl] = useState("");

  const handleAddSource = useCallback(async () => {
    // 최대 소스 개수 검증
    if (sources.length >= maxSourceCount) {
      toast.error("현재 플랜의 최대 소스 개수에 도달했습니다.");
      return;
    }

    // 중복 소스 검증
    if (sources.some((source) => source.url === sourceUrl)) {
      toast.error("이미 추가된 소스입니다.");
      return;
    }

    // 소스 URL이 비어있는 경우
    if (!sourceUrl) {
      toast.error("소스 URL을 입력해주세요.");
      return;
    }

    try {
      new URL(sourceUrl);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("유효한 URL 형식이 아닙니다.");
      return;
    }

    // URL 형식 검증
    await validateSourceUrl({
      url: sourceUrl,
    });
  }, [maxSourceCount, sourceUrl, sources, validateSourceUrl]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddSource();
      }
    },
    [handleAddSource]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">요약 소스 추가</h3>

      <div>
        <p className="text-sm font-medium">
          유튜브 채널 또는 블로그 RSS 주소를 입력해주세요.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Input
            placeholder="소스 URL"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Button
            variant="outline"
            type="button"
            onClick={handleAddSource}
            isLoading={isPending}
          >
            소스 추가
          </Button>
        </div>
      </div>
    </div>
  );
};
