import { FormStepProps } from "@/modules/common/form-steps/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const keywordSchema = z.object({
  keyword: z.string().min(1, "핵심 키워드를 입력해주세요"),
});

export const KeywordForm = ({
  onNext,
  initialData,
}: FormStepProps<{
  keyword: string;
}>) => {
  const form = useForm<{
    keyword: string;
  }>({
    resolver: zodResolver(keywordSchema),
    defaultValues: {
      keyword: initialData?.keyword || "",
    },
  });

  const formRef = useSlideInAnimation<HTMLFormElement>(".form-item", {
    duration: 0.5,
    stagger: 0.1,
    xOffset: 100,
    ease: "power2.out",
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem className="form-item">
              <FormLabel>핵심 키워드</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="작성할 콘텐츠의 핵심 키워드를 입력해주세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">다음</Button>
        </div>
      </form>
    </Form>
  );
};
