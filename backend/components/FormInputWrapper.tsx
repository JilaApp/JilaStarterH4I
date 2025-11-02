import React from "react";
import { Ban } from "lucide-react";

export type FormInputState = "default" | "error" | "pending" | "complete";

interface FormInputWrapperProps<T>
  extends Omit<
    React.HTMLProps<HTMLDivElement>,
    "value" | "onChange" | "children"
  > {
  title: string;
  required?: boolean;
  children: React.ReactNode;
  state?: FormInputState;
  setState?: (state: FormInputState) => void;
  errorString?: string;
  description?: string;
  titleClassName?: string;
  value?: T;
  onChange?: (val: T) => void;
}

export default function FormInputWrapper<T>({
  title,
  required = false,
  children,
  state = "default",
  setState,
  errorString = "This field is required",
  className = "",
  description,
  titleClassName = "",
  value,
  onChange = () => {},
  ...rest
}: FormInputWrapperProps<T>) {
  const handleChange = (val: T) => {
    onChange(val);
    if (state !== "default") {
      setState?.("default");
    }
  };

  let childWithState: React.ReactNode;

  if (React.isValidElement(children)) {
    childWithState = React.cloneElement(children, {
      ...children.props,
      value,
      onChange: handleChange,
      state,
      ...rest,
    });
  } else {
    childWithState = children;
  }

  return (
    <div
      className={`flex flex-col w-full font-[400] text-[18px]  ${className} `}
    >
      <div className="flex items-center gap-1 h-[30px] mb-1">
        <span className={titleClassName}>{title}</span>
        {required && <span className="text-[var(--color-error-400)]">*</span>}
      </div>

      {childWithState}

      {state === "error" && (
        <div className="flex items-center gap-[3px] pt-[8px] text-[var(--color-error-400)] text-[18px]">
          <div className="flex items-center justify-center ">
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
