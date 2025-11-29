import { memo, useCallback } from "react";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  numOptions: number;
  selectedOption: number;
  onChange: (option: number) => void;
}

const Pagination = memo(function Pagination({
  numOptions,
  selectedOption,
  onChange,
}: PaginationProps) {
  const disabledLeft = selectedOption <= 1;
  const disabledRight = selectedOption >= numOptions;

  const handleClick = useCallback(
    (newSelection: number) => {
      onChange(newSelection);
    },
    [onChange],
  );

  return (
    <div className="flex items-center body1-desktop-text text-md font-semibold">
      <button
        disabled={disabledLeft}
        onClick={() => handleClick(1)}
        className={disabledLeft ? "cursor-default" : "cursor-pointer"}
      >
        <ChevronFirst size={28} color={disabledLeft ? "#D7D7D7" : "black"} />
      </button>
      <div className="p-5 w-50 flex flex-row items-center justify-center">
        Page {selectedOption} of {numOptions}
      </div>
      <button
        disabled={disabledLeft}
        onClick={() => handleClick(selectedOption - 1)}
        className={disabledLeft ? "cursor-default" : "cursor-pointer"}
      >
        <ChevronLeft size={28} color={disabledLeft ? "#D7D7D7" : "black"} />
      </button>
      <button
        disabled={disabledRight}
        onClick={() => handleClick(selectedOption + 1)}
        className={`pl-3 ${disabledRight ? "cursor-default" : "cursor-pointer"}`}
      >
        <ChevronRight size={28} color={disabledRight ? "#D7D7D7" : "black"} />
      </button>
    </div>
  );
});

export default Pagination;
