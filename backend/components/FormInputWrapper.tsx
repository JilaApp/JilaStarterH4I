import React from "react";
import { Ban } from "lucide-react";

interface FormInputWrapperProps {
  title: string;
  required?: boolean;
  children: React.ReactNode;
  state?: "normal" | "error";
  errorString?: string;
}

export default function FormInputWrapper({
  title,
  required = false,
  children,
  state = "normal",
  errorString = "This field is required",
}: FormInputWrapperProps) {
  const childWithState = React.isValidElement(children)
    ? React.cloneElement(children, { state })
    : children;

  return (
    <div className="flex flex-col w-full font-[400] text-[18px]">
      <div className="flex items-center gap-1 h-[30px]">
        <span>{title}</span>
        {required && <span className="text-[var(--color-error-400)]">*</span>}
      </div>{" "}
      {childWithState}
      {state === "error" && (
        <div className="flex items-center gap-[3px] pt-[8px] text-[var(--color-error-400)] text-sm">
          <div className="flex items-center justify-center ">
            <Ban width={"20px"} height={"20px"} />
          </div>
          <span className="font-[500]">{errorString}</span>
        </div>
      )}
    </div>
  );
}
