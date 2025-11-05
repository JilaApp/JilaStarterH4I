import React from "react";
import { Ban } from "lucide-react";
import type { FormInputState } from "@/lib/types";

interface FormFieldProps<T> {
  title: string;
  required?: boolean;
  children: (props: {
    value: T;
    onChange: (val: T) => void;
  }) => React.ReactElement;
  state?: FormInputState;
  errorString?: string;
  description?: string;
  value?: T;
  onChange?: (val: T) => void;
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
  defaultClassName = "",
}: FormFieldProps<T>) {
  const handleChange = (val: T) => {
    onChange(val);
  };

  return (
    <div
      className={`flex flex-col w-full font-[400] text-[18px] ${defaultClassName}`}
    >
      <div className="flex items-center gap-1 h-[30px] mb-1">
        <span>{title}</span>
        {required && <span className="text-[var(--color-error-400)]">*</span>}
      </div>
      {children({
        value: value as T,
        onChange: handleChange,
      })}
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
