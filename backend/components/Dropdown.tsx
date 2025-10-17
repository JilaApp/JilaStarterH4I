import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  options: string[];
  currentIndex?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  state?: "normal" | "error";
}

export default function Dropdown({
  options,
  currentIndex = undefined,
  onChange,
  placeholder = "Choose the most applicable",
  state = "normal",
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
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-[60px] border-[1px] ${state == "normal" ? "border-gray-300" : "border-[var(--color-error-400)]"} rounded-[10px] px-[16px] py-[10px] bg-white text-left flex justify-between items-center font-[500] cursor-pointer ${
          currentIndex !== undefined ? "text-black" : "text-gray-400"
        }`}
      >
        <span>
          {currentIndex !== undefined ? options[currentIndex] : placeholder}
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          color="black"
        />
      </button>

      <ul
        className={`absolute z-10 mt-1 w-full border-[1px] rounded-[10px] border-gray-300 bg-white shadow-lg max-h-60 overflow-auto divide-y divide-gray-200 text-black font-[500] 
          transform transition-all duration-300 origin-top
          ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}
        `}
      >
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => {
              onChange(index);
              setIsOpen(false);
            }}
            className={`px-[16px] py-[10px] hover:bg-gray-100 cursor-pointer ${
              currentIndex !== undefined && index == currentIndex
                ? "bg-gray-200"
                : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
