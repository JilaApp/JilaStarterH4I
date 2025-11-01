import React from "react";

interface ParagraphInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export default function ParagraphInput({
  placeholder = "Add a description",
  value = "",
  onChange = (val: string) => {},
}: ParagraphInputProps) {
  return (
    <div className="flex flex-col w-full">
      <textarea
        className={`
          w-full min-h-[120px] p-3 rounded-[10px]
          border-[1px] border-[var(--color-gray-200)] outline-none resize-none
          text-[18px] leading-[22px]
        placeholder:text-[var(--color-gray-300)] placeholder:font-[500]
        focus:border-[var(--color-jila-400)]
        `}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
