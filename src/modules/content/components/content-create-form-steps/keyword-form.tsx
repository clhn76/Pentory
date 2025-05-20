import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormStepProps } from "@/modules/common/form-steps/types";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const keywordFormSchema = z.object({
  keyword: z.string().min(1, "핵심 키워드를 입력해주세요"),
});

export type KeywordFormData = z.infer<typeof keywordFormSchema>;

export const KeywordForm = ({
  onNext,
  initialData,
}: FormStepProps<{
  keyword: string;
}>) => {
  const form = useForm<{
    keyword: string;
  }>({
    resolver: zodResolver(keywordFormSchema),
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
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            어떤 콘텐츠를 만들고 싶으신가요?
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            블로그, 소셜 미디어 게시물, 유튜브 스크립트등 다양한 콘텐츠를 만들
            수 있습니다.
          </p>
        </div>

        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem className="form-item">
              <FormControl>
                <Input {...field} placeholder="핵심 키워드" />
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
