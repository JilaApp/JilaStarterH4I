import { X } from "lucide-react";

interface FilterBarProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

export default function FilterBar({
  options,
  selectedOptions,
  setSelectedOptions,
}: FilterBarProps) {
  const handleFilterClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleClearFilters = () => {
    setSelectedOptions([]);
  };

  return (
    <div className="flex items-center gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleFilterClick(option)}
          className={`flex items-center gap-2 px-4 h-10 rounded-lg font-bold body2-desktop-text transition-colors ${
            selectedOptions.includes(option)
              ? "bg-jila-400 text-white hover:bg-type-400"
              : "bg-white text-gray-400 hover:bg-gray-200"
          }`}
        >
          {option}
          {selectedOptions.includes(option) && <X size={16} strokeWidth={3} />}
        </button>
      ))}
      <button
        onClick={handleClearFilters}
        className="text-jila-400 underline body2-desktop-text font-semibold whitespace-nowrap ml-2"
      >
        Clear filters
      </button>
    </div>
  );
}
