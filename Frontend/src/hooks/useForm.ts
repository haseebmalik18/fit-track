import { useState, useCallback } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (name: keyof T, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: keyof T, value: string) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name as string]) {
        setErrors((prev) => ({
          ...prev,
          [name as string]: "",
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Run validation if provided
        if (validate) {
          const validationErrors = validate(values);
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
        }

        // Clear any existing errors
        setErrors({});

        // Call onSubmit
        await onSubmit(values);
      } catch (error) {
        // Handle submission errors
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field as string]: error,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
    clearErrors,
    reset,
  };
}
