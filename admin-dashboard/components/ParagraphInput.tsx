import clsx from "clsx";
import React from "react";
import type { FormInputState } from "@/lib/types";

interface ParagraphInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  state?: FormInputState;
}

export default function ParagraphInput({
  placeholder = "Add a description",
  value = "",
  onChange = (val: string) => {},
  disabled = false,
  state = "default",
}: ParagraphInputProps) {
  return (
    <div className="flex flex-col w-full">
      <textarea
        className={clsx(
          `
          w-full min-h-[120px] p-3 rounded-lg
          border border-gray-300 outline-none resize-none
          text-lg leading-[22px] font-semibold
        placeholder:text-gray-300 placeholder:font-semibold
        focus:border-jila-400 `,
          {
            "border-gray-300 bg-gray-200 cursor-not-allowed text-gray-300":
              disabled,
            "text-type-400": !disabled,
          },
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
