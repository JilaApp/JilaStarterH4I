import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  placeholder = "Search",
  value,
  onChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-white-400 px-[20px] py-[5px] h-[40px] w-[350px] rounded-[15px] border-[1px] ${
        isFocused ? "border-jila-400" : "border-gray-200"
      }`}
    >
      <Search size={20} className="text-gray-300" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(205,205,205)"
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="ml-2 flex-1 bg-transparent text-black"
        style={{ outlineWidth: 0 }}
      />
    </View>
  );
}
