/* eslint-disable @typescript-eslint/no-explicit-any */

export type FormStepProps<T> = {
  onNext: (data: T) => void;
  onBack?: () => void;
  initialData?: Partial<T>;
  formData: Record<string, any>;
};
