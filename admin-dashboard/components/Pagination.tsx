import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  numOptions: number;
  selectedOption: number;
  onChange: (option: number) => void;
}

export default function Pagination({
  numOptions,
  selectedOption,
  onChange,
}: PaginationProps) {
  const [disabledLeft, setDisabledLeft] = useState(selectedOption == 1);
  const [disabledRight, setDisabledRight] = useState(
    selectedOption == numOptions
  );

  const handleClick = (newSelection: number) => {
    onChange(newSelection);
    setDisabledLeft(newSelection == 1);
    setDisabledRight(newSelection == numOptions);
  };

  return (
    <div className="flex items-center body1-desktop-text text-md font-semibold">
      <button
        disabled={disabledLeft}
        onClick={() => handleClick(1)}
        style={{ cursor: disabledLeft ? "default" : "pointer" }}
      >
        <ChevronFirst size={28} color={disabledLeft ? "#D7D7D7" : "black"} />
      </button>
      <div className="p-5 w-50 flex flex-row items-center justify-center">
        Page {selectedOption} of {numOptions}
      </div>
      <button
        disabled={disabledLeft}
        onClick={() => handleClick(selectedOption - 1)}
        style={{ cursor: disabledLeft ? "default" : "pointer" }}
      >
        <ChevronLeft size={28} color={disabledLeft ? "#D7D7D7" : "black"} />
      </button>
      <button
        disabled={disabledRight}
        onClick={() => handleClick(selectedOption + 1)}
        className="pl-3"
        style={{ cursor: disabledRight ? "default" : "pointer" }}
      >
        <ChevronRight size={28} color={disabledRight ? "#D7D7D7" : "black"} />
      </button>
    </div>
  );
}
