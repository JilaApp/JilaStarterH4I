import React from "react";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search",
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg w-96 bg-white">
      <Search size={20} className="text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none flex-1 body2-desktop-text placeholder:text-gray-400 bg-transparent"
      />
    </div>
  );
}
