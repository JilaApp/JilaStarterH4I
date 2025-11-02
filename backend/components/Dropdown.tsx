import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block max-w-[450px]" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full h-[60px] border-[1px] ${
          state == "default"
            ? "border-gray-300"
            : "border-[var(--color-error-400)] shadow-[0_0_0_3px_#FFA8A8]"
        } rounded-[10px] px-[16px] py-[10px] ${
          disabled
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white cursor-pointer"
        } text-left flex justify-between items-center font-[500] ${
          value !== undefined ? "text-black" : "text-gray-300"
        }`}
      >
        <span>{value !== undefined ? options[value] : placeholder}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          color="black"
        />
      </button>

      <ul
        className={`absolute z-10 mt-1 w-full border-[1px] rounded-[10px] border-gray-300 bg-white shadow-lg max-h-60 overflow-auto divide-y divide-gray-200 text-black font-[500]
          transform transition-all duration-300 origin-top
          ${
            isOpen
              ? "scale-y-100 opacity-100"
              : "scale-y-0 opacity-0 pointer-events-none"
          }
        `}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => {
              if (disabled) return;
              onChange(index);
              setIsOpen(false);
            }}
            className={`px-[16px] py-[10px] hover:bg-gray-100 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${value !== undefined && index == value ? "bg-gray-200" : ""}`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
