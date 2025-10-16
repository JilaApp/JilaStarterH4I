import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  options: string[];
  currentValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({
  options,
  currentValue,
  onChange,
  placeholder = "Choose the most applicable",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-[60px] border-[1px] border-gray-300 rounded-[10px] px-[16px] py-[10px] bg-white text-left flex justify-between items-center font-[500] cursor-pointer ${
          currentValue ? "text-black" : "text-gray-400"
        }`}
      >
        <span>{currentValue || placeholder}</span>
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
        {options.map((option) => (
          <li
            key={option}
            onClick={() => {
              onChange(option);
              setIsOpen(false);
            }}
            className={`px-[16px] py-[10px] hover:bg-gray-100 cursor-pointer ${
              option === currentValue ? "bg-gray-200" : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
