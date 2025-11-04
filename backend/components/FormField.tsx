import React, { ReactElement, cloneElement } from "react";
import { Ban } from "lucide-react";
import type { FormInputState } from "@/hooks/useForm";

interface FormFieldProps<T> {
  title: string;
  required?: boolean;
  children: ReactElement;
  state?: FormInputState;
  errorString?: string;
  description?: string;
  value?: T;
  onChange?: (val: T) => void;
  onBlur?: () => void;
  validate?: (value: T) => string | null;
  defaultClassName?: string;
}

export default function FormField<T>({
  title,
  required = false,
  children,
  state = "default",
  errorString = "This field is required",
  description,
  value,
  onChange = () => {},
  onBlur,
  validate,
  defaultClassName = "",
}: FormFieldProps<T>) {
  const handleChange = (val: T) => {
    onChange(val);
  };

  const handleBlur = () => {
    if (validate && value !== undefined) {
      const error = validate(value);
      if (error && onBlur) {
        onBlur();
      }
    }
    if (onBlur) {
      onBlur();
    }
  };

  const childWithProps = React.isValidElement(children)
    ? cloneElement(children, {
        ...children.props,
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        state,
      })
    : children;

  return (
    <div
      className={`flex flex-col w-full font-[400] text-[18px] ${defaultClassName}`}
    >
      <div className="flex items-center gap-1 h-[30px] mb-1">
        <span>{title}</span>
        {required && <span className="text-[var(--color-error-400)]">*</span>}
      </div>
      {childWithProps}
      {state === "error" && errorString && (
        <div className="flex items-center gap-[3px] pt-[8px] text-[var(--color-error-400)] text-[18px]">
          <div className="flex items-center justify-center">
            <Ban width={"20px"} height={"20px"} />
          </div>
          <span className="font-[500]">{errorString}</span>
        </div>
      )}
      {description && (
        <div className="flex items-center text-[18px] text-[var(--color-gray-400)] font-[300] pt-[8px]">
          {description}
        </div>
      )}
    </div>
  );
}
