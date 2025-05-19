import { useRef, useState } from "react";
import { FormStepProps } from "../types";

export type FormStepsProps<T extends Record<string, unknown>> = {
  steps: {
    id: string;
    component: React.ComponentType<FormStepProps<T[keyof T]>>;
  }[];
  onComplete: (data: T) => void;
  initialData?: Partial<T>;
};

export const FormSteps = <T extends Record<string, unknown>>({
  steps,
  onComplete,
  initialData = {},
}: FormStepsProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData as T);
  const stepRef = useRef<HTMLDivElement>(null);

  const handleNext = (stepData: T[keyof T]) => {
    setFormData((prev) => ({
      ...prev,
      [steps[currentStep].id]: stepData,
    }));

    if (currentStep === steps.length - 1) {
      onComplete(formData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id as string}
            className={`flex items-center ${
              index !== steps.length - 1 ? "flex-1" : ""
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div ref={stepRef} className="relative">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          initialData={formData[steps[currentStep].id] as Partial<T[keyof T]>}
          formData={formData}
        />
      </div>
    </div>
  );
};
