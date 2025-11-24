import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

export default function SearchBar({
  placeholder = "Search",
  value,
  onChange,
  isFocused,
  onFocus,
  onBlur,
}: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center bg-white-400 px-[20px] h-[50px] w-[360px] rounded-[20px] border-[1px] ${
        isFocused ? "border-jila-400" : "border-gray-200"
      }`}
    >
      <Search size={24} color="#A1A1A1" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A1A1A1"
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="ml-2 flex-1 bg-transparent text-black font-bold"
        style={{
          outlineWidth: 0,
          height: 50,
          paddingVertical: 0,
          fontWeight: "700",
          fontSize: 18,
        }}
        scrollEnabled={false}
        multiline={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange("")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={22} color="#000" />
        </TouchableOpacity>
      )}
    </View>
  );
}
