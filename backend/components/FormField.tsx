import React, { ReactElement, cloneElement, isValidElement } from "react";
import { Ban } from "lucide-react";
import type { FormInputState } from "@/lib/types";

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
  // Allow passing any additional props to children
  [key: string]: any;
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
  ...additionalProps
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

  // Filter out FormField-specific props before passing to children
  const {
    title: _title,
    required: _required,
    children: _children,
    errorString: _errorString,
    description: _description,
    validate: _validate,
    defaultClassName: _defaultClassName,
    ...propsForChildren
  } = additionalProps;

  const childWithProps = isValidElement(children)
    ? cloneElement(children, {
        ...(typeof children.props === "object" && children.props !== null
          ? children.props
          : {}),
        ...propsForChildren,
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        state,
      } as any)
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
