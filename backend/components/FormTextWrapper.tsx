"use client";
import { useState, ReactElement, cloneElement } from "react";

interface FormTextWrapperProps {
  required?: boolean;
  validate?: (value: string) => string | null;
  value?: string;
  error?: string;
  initialValue?: string;
  children: ReactElement;
  onValueChange?: (value: string) => void;
  onErrorChange?: (error: string) => void;
}

export default function FormTextWrapper({
  required = false,
  validate,
  value: controlledValue,
  error: controlledError,
  initialValue = "",
  children,
  onValueChange,
  onErrorChange,
}: FormTextWrapperProps) {
  const [internalValue, setInternalValue] = useState(initialValue);
  const [internalError, setInternalError] = useState("");

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const error = controlledError !== undefined ? controlledError : internalError;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);

    if (error) {
      if (controlledError === undefined) {
        setInternalError("");
      }
      onErrorChange?.("");
    }
  };

  const handleBlur = (_e?: React.FocusEvent<HTMLInputElement>) => {
    let newError = "";

    if (required && !value.trim()) {
      newError = "This field is required";
    } else if (validate) {
      const validationError = validate(value);
      if (validationError) {
        newError = validationError;
      }
    }

    if (controlledError === undefined) {
      setInternalError(newError);
    }
    onErrorChange?.(newError);
  };

  return cloneElement(children, {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    state: error ? ("error" as const) : ("default" as const),
    ...children.props,
  });
}
