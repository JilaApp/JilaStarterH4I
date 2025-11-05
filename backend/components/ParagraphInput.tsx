import clsx from "clsx";
import React from "react";

interface ParagraphInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

export default function ParagraphInput({
  placeholder = "Add a description",
  value = "",
  onChange = (val: string) => {},
  disabled = false,
}: ParagraphInputProps) {
  return (
    <div className="flex flex-col w-full">
      <textarea
        className={clsx(
          `
          w-full min-h-[120px] p-3 rounded-lg
          border border-gray-200 outline-none resize-none
          text-lg leading-[22px]
        placeholder:text-gray-300 placeholder:font-[500]
        focus:border-jila-400 `,
          disabled && "border-gray-300 bg-gray-200 cursor-not-allowed",
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
