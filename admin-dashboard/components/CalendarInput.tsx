import { Calendar } from "lucide-react";
import clsx from "clsx";
import { useRef } from "react";
import type { FormInputState } from "@/lib/types";

interface CalendarInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
  state?: FormInputState;
  className?: string;
}

export default function CalendarInput({
  placeholder = "Select date",
  value = "",
  onChange = (val: string) => {},
  disabled = false,
  state = "default",
  className = "",
}: CalendarInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-[10px] w-full border rounded-[10px] px-[16px]",
        {
          "h-[60px]": className.length === 0, // Only apply default height if no className is provided
          "border-gray-300 bg-gray-200": disabled,
          "border-error-400 bg-white": !disabled && state === "error",
          "border-gray-300 bg-white": !disabled && state !== "error",
          "cursor-pointer": !disabled,
        },
        className,
      )}
      style={
        state === "error"
          ? {
              boxShadow: "0 0 0 3px #FFA8A8",
            }
          : undefined
      }
      onClick={handleContainerClick}
    >
      <Calendar size={24} className="text-gray-300 shrink-0" />
      <input
        ref={inputRef}
        type="date"
        className={clsx(
          "flex-1 bg-transparent outline-none font-semibold text-lg cursor-pointer",
          {
            "cursor-not-allowed text-gray-300": disabled,
            "text-gray-300": !disabled && !value,
            "text-type-400": !disabled && value,
          },
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
