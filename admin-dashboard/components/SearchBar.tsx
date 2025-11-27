import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultClassName?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  defaultClassName = "w-96",
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg ${defaultClassName} bg-white`}
    >
      <Search size={20} className="text-gray-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none flex-1 body2-desktop-text placeholder:text-gray-300 text-type-400 bg-transparent font-semibold"
      />
    </div>
  );
}
