"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SPACE_HREF_PREFIX } from "../config";

interface DeleteSpaceCardProps {
  spaceId: string;
  spaceName: string;
}

export const DeleteSpaceCard = ({
  spaceId,
  spaceName,
}: DeleteSpaceCardProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inputName, setInputName] = useState("");

  const deleteSpace = useMutation(
    trpc.spaceRouter.deleteSpace.mutationOptions({
      onSuccess: () => {
        toast.success("스페이스가 삭제되었습니다.");
        queryClient.invalidateQueries({
          queryKey: trpc.spaceRouter.getSpaces.queryKey(),
        });
        router.push(SPACE_HREF_PREFIX.MY);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">스페이스 삭제</CardTitle>
        <CardDescription>
          스페이스를 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
          되돌릴 수 없습니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive-outline" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              스페이스 삭제
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>스페이스 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 &quot;{spaceName}&quot; 스페이스를 삭제하시겠습니까? 이
                작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="스페이스 이름을 입력하세요"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteSpace.mutate({ spaceId })}
                disabled={inputName !== spaceName}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
