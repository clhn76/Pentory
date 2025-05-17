"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const summaryUrlFormSchema = z.object({
  url: z
    .string()
    .min(1, "URL을 입력해주세요")
    .url("올바른 URL 형식이 아닙니다"),
});

export type SummaryUrlFormValues = z.infer<typeof summaryUrlFormSchema>;

interface SummaryUrlFormProps {
  onSubmit: (values: SummaryUrlFormValues) => Promise<void>;
  disabled?: boolean;
}

export const SummaryUrlForm = ({
  onSubmit,
  disabled = false,
}: SummaryUrlFormProps) => {
  const form = useForm<SummaryUrlFormValues>({
    resolver: zodResolver(summaryUrlFormSchema),
    defaultValues: {
      url: "",
    },
    disabled,
  });

  const handleSubmit = async (values: SummaryUrlFormValues) => {
    form.reset();
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <Button type="submit" disabled={disabled}>
                  요약하기
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
