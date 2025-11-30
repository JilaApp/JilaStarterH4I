import { useState, useCallback } from "react";

export type FormInputState = "default" | "error" | "pending" | "complete";

export interface FieldConfig<T = unknown> {
  value: T;
  error: string;
  state: FormInputState;
}

export interface FormConfig {
  [key: string]: FieldConfig;
}

export function createField<T>(value: T): FieldConfig<T> {
  return {
    value,
    error: "",
    state: "default",
  };
}

export function useForm<T extends FormConfig>(initialConfig: T) {
  const [fields, setFields] = useState<T>(initialConfig);

  const setFieldValue = useCallback(
    <K extends keyof T>(fieldName: K, value: T[K]["value"]) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          error: "",
          state: "default" as FormInputState,
        },
      }));
    },
    [],
  );

  const setFieldError = useCallback(
    <K extends keyof T>(
      fieldName: K,
      error: string,
      state?: FormInputState,
    ) => {
      const fieldState = state ?? (error ? "error" : "default");

      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          error,
          state: fieldState,
        },
      }));
    },
    [],
  );

  const setFieldState = useCallback(
    <K extends keyof T>(fieldName: K, state: FormInputState) => {
      setFields((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          state,
        },
      }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFields(initialConfig);
  }, [initialConfig]);

  const validateField = useCallback(
    <K extends keyof T>(
      fieldName: K,
      validator?: (value: T[K]["value"]) => string | null,
    ): boolean => {
      if (!validator) return true;

      const error = validator(fields[fieldName].value);
      if (error) {
        setFieldError(fieldName, error);
        return false;
      }
      return true;
    },
    [fields, setFieldError],
  );

  const validateAllFields = useCallback(
    <K extends keyof T>(
      validators: Partial<{
        [P in K]: (value: T[P]["value"]) => string | null;
      }>,
    ): boolean => {
      let isValid = true;
      Object.keys(validators).forEach((key) => {
        const fieldName = key as K;
        const validator = validators[fieldName];
        if (
          validator &&
          !validateField(
            fieldName,
            validator as (value: T[K]["value"]) => string | null,
          )
        ) {
          isValid = false;
        }
      });
      return isValid;
    },
    [validateField],
  );

  return {
    fields,
    setFieldValue,
    setFieldError,
    setFieldState,
    resetForm,
    validateField,
    validateAllFields,
  };
}
