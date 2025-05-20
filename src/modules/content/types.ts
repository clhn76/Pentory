import { AdditionalFormData } from "./components/content-create-form-steps/additional-form";
import { KeywordFormData } from "./components/content-create-form-steps/keyword-form";
import { TemplateFormData } from "./components/content-create-form-steps/template-form";
import { TopContentFormData } from "./components/content-create-form-steps/top-content-form";

export interface ContentFormData {
  keyword: KeywordFormData;
  topContent: TopContentFormData;
  template: TemplateFormData;
  additional: AdditionalFormData;
}
