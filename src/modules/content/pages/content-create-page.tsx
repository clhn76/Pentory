"use client";

import { FormSteps } from "@/modules/common/form-steps/components/form-steps";
import { KeywordForm } from "../components/content-create-form-steps/keyword-form";
import { SelectTopContentForm } from "../components/content-create-form-steps/select-top-content-form";

export const ContentCreatePage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">콘텐츠 생성 엔진</h1>
      <FormSteps
        steps={[
          {
            id: "keyword-form",
            component: KeywordForm,
          },
          {
            id: "select-top-content-form",
            component: SelectTopContentForm,
          },
        ]}
        onComplete={() => {}}
      />
    </div>
  );
};
