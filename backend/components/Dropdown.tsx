import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import clsx from "clsx";

interface DropdownProps {
  options: string[];
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  state?: "default" | "error";
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value = undefined,
  onChange = (val: number) => {},
  placeholder = "Choose the most applicable",
  state = "default",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={clsx(
          "w-full h-[60px] border-[1px] rounded-[10px] px-[16px] py-[10px]",
          "text-left flex justify-between items-center font-[500]",
          {
            "border-gray-300": state === "default",
            "border-[var(--color-error-400)] shadow-[0_0_0_3px_#FFA8A8]":
              state === "error",
            "bg-gray-200 cursor-not-allowed": disabled,
            "bg-white cursor-pointer": !disabled,
            "text-black": value !== undefined,
            "text-gray-300": value === undefined,
          },
        )}
      >
        <span>{value !== undefined ? options[value] : placeholder}</span>
        <ChevronDown
          className={clsx("transition-transform duration-300", {
            "rotate-180": isOpen,
            "rotate-0": !isOpen,
          })}
          color="black"
        />
      </button>

      <ul
        className={clsx(
          "absolute z-10 mt-1 w-full border-[1px] rounded-[10px] border-gray-300",
          "bg-white shadow-lg max-h-60 overflow-auto divide-y divide-gray-200",
          "text-black font-[500] transform transition-all duration-300 origin-top",
          {
            "scale-y-100 opacity-100": isOpen,
            "scale-y-0 opacity-0 pointer-events-none": !isOpen,
          },
        )}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => {
              if (disabled) return;
              onChange(index);
              setIsOpen(false);
            }}
            className={clsx("px-[16px] py-[10px] hover:bg-gray-100", {
              "cursor-not-allowed": disabled,
              "cursor-pointer": !disabled,
              "bg-gray-200": value !== undefined && index === value,
            })}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
