"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const feedbackSchema = z.object({
  content: z.string().min(1, "피드백을 입력해주세요."),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const FeedbackDialog = () => {
  const trpc = useTRPC();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });
  const [open, setOpen] = useState(false);

  const mutation = useMutation(
    trpc.feedbackRouter.submitFeedback.mutationOptions()
  );

  const onSubmit = (data: FeedbackFormData) => {
    mutation.mutate(
      { content: data.content },
      {
        onSuccess: () => {
          toast.success(
            "소중한 피드백 감사드립니다. \n빠른 시간 내에 확인하겠습니다."
          );
          reset();
          setOpen(false);
        },
        onError: () => {
          toast.error("피드백 전송에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          피드백 보내기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>피드백 보내기</DialogTitle>
          <DialogDescription>
            버그 제보나 새로운 기능 요청을 보내주세요. 여러분의 의견은 서비스
            개선에 큰 도움이 됩니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              placeholder="피드백을 입력해주세요..."
              {...register("content")}
              className="min-h-[150px]"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" isLoading={mutation.isPending}>
              제출하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
