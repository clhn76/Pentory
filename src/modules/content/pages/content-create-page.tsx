"use client";

import { FormSteps } from "@/modules/common/form-steps/components/form-steps";
import { KeywordForm } from "../components/content-create-form-steps/keyword-form";
import { TopContentForm } from "../components/content-create-form-steps/top-content-form";
import { TemplateForm } from "../components/content-create-form-steps/template-form";
import { AdditionalForm } from "../components/content-create-form-steps/additional-form";
import { useState } from "react";
import { ContentFormData } from "../types";
import { ContentEditor } from "../components/content-editor";

export const ContentCreatePage = () => {
  const [contentFormData, setContentFormData] =
    useState<ContentFormData | null>(null);

  return (
    <div className="container max-w-screen-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">콘텐츠 생성 엔진</h1>
      {!contentFormData ? (
        <FormSteps
          steps={[
            {
              id: "keyword",
              component: KeywordForm,
            },
            {
              id: "topContent",
              component: TopContentForm,
            },
            {
              id: "template",
              component: TemplateForm,
            },
            {
              id: "additional",
              component: AdditionalForm,
            },
          ]}
          onComplete={(data) => {
            setContentFormData(data as ContentFormData);
          }}
        />
      ) : (
        <ContentEditor
          contentFormData={contentFormData}
          onBack={() => setContentFormData(null)}
        />
      )}
    </div>
  );
};
