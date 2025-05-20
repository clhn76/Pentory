/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import { FormStepProps } from "../types";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

export type FormStepsProps<T extends Record<string, any>> = {
  steps: {
    id: string;
    component: React.ComponentType<FormStepProps<T[keyof T]>>;
  }[];
  onComplete: (data: T) => void;
  initialData?: Partial<T>;
  className?: ClassValue;
};

export const FormSteps = <T extends Record<string, any>>({
  steps,
  onComplete,
  initialData = {},
  className,
}: FormStepsProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<T>(initialData as T);
  const stepRef = useRef<HTMLDivElement>(null);

  const handleNext = (stepData: T[keyof T]) => {
    const updatedData = {
      ...formData,
      [steps[currentStep].id]: stepData,
    };

    if (currentStep === steps.length - 1) {
      onComplete(updatedData);
    } else {
      setFormData(updatedData);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // 이전 스텝으로 돌아가기 전에 현재 스텝의 데이터를 초기화
    setFormData((prev) => ({
      ...prev,
      [steps[currentStep].id]: {},
    }));
    setCurrentStep((prev) => prev - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className={cn("w-full mx-auto space-y-8 max-w-2xl", className)}>
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
