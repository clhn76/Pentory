import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSlideInAnimation } from "@/modules/common/gsap/hooks/use-slide-in-animation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormStepProps } from "@/modules/common/form-steps/types";
import { CONTENT_TEMPLATES } from "../../templates";

const templateFormSchema = z.object({
  templateId: z.string().min(1, "템플릿을 선택해 주세요"),
});

export type TemplateFormData = z.infer<typeof templateFormSchema>;

export const TemplateForm = ({
  onNext,
  onBack,
  initialData,
}: FormStepProps<TemplateFormData>) => {
  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      templateId: initialData?.templateId || "",
    },
  });

  const formRef = useSlideInAnimation<HTMLFormElement>(".form-item", {
    duration: 0.5,
    stagger: 0.1,
    xOffset: 100,
    ease: "power2.out",
  });

  const handleTemplateSelect = (templateId: string) => {
    form.setValue("templateId", templateId);
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">템플릿 선택</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {CONTENT_TEMPLATES.map((contentTemplate) => (
              <div
                key={contentTemplate.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  form.watch("templateId") === contentTemplate.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleTemplateSelect(contentTemplate.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleTemplateSelect(contentTemplate.id);
                  }
                }}
              >
                <h3 className="font-medium">{contentTemplate.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {contentTemplate.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            이전
          </Button>
          <Button type="submit">다음</Button>
        </div>
      </form>
    </Form>
  );
};
