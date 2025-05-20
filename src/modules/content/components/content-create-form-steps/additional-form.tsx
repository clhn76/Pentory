import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormStepProps } from "@/modules/common/form-steps/types";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const additionalFormSchema = z.object({
  additionalInfo: z.string().optional(),
  useStockImage: z.boolean().default(true),
  // customImages: z.array(z.string()).default([]),
});

export type AdditionalFormData = z.infer<typeof additionalFormSchema>;

export const AdditionalForm = ({
  onNext,
  onBack,
  initialData,
}: FormStepProps<AdditionalFormData>) => {
  const form = useForm<AdditionalFormData>({
    resolver: zodResolver(additionalFormSchema),
    defaultValues: {
      additionalInfo: initialData?.additionalInfo || "",
      useStockImage: initialData?.useStockImage || true,
      // customImages: initialData?.customImages || [],
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
          name="additionalInfo"
          render={({ field }) => (
            <FormItem className="form-item">
              <FormLabel>추가 지시 사항(선택)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={24}
                  placeholder="콘텐츠에 포함할 추가 정보 혹은 지시 사항을 입력해주세요"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="useStockImage"
            render={({ field }) => (
              <FormItem className="form-item flex items-center gap-2 justify-between">
                <FormLabel>스톡 이미지 자동 삽입</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="customImages"
            render={() => (
              <FormItem className="form-item flex items-center gap-2 justify-between">
                <FormLabel>사용자 지정 이미지 추가</FormLabel>
                <FormControl>
                  <Button variant="outline">이미지 추가</Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button type="submit">생성</Button>
        </div>
      </form>
    </Form>
  );
};
