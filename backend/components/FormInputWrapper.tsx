import React from "react";
import { Ban } from "lucide-react";

interface FormInputWrapperProps {
  title: string;
  required?: boolean;
  children: React.ReactNode;
  state?: "default" | "error" | "pending" | "complete";
  errorString?: string;
  description?: string;
}

export default function FormInputWrapper({
  title,
  required = false,
  children,
  state = "default",
  errorString = "This field is required",
  description,
}: FormInputWrapperProps) {
  const childWithState = React.isValidElement(children)
    ? React.cloneElement(children, { state })
    : children;

  return (
    <div className="flex flex-col w-full font-[400] text-[18px]">
      <div className="flex items-center gap-1 h-[30px] mb-1">
        <span>{title}</span>
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
