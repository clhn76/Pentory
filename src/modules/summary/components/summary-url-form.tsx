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

const formSchema = z.object({
  url: z.string().url("올바른 URL을 입력해주세요."),
});

export type SummaryUrlFormValues = z.infer<typeof formSchema>;

interface SummaryUrlFormProps {
  onSubmit: (values: SummaryUrlFormValues) => void;
  disabled?: boolean;
}

export const SummaryUrlForm = ({ onSubmit, disabled }: SummaryUrlFormProps) => {
  const form = useForm<SummaryUrlFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-4"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  disabled={disabled}
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {disabled ? "요약 중..." : "요약하기"}
        </Button>
      </form>
    </Form>
  );
};
