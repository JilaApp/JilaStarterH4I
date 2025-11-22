import React from "react";
import { View, TextInput } from "react-native";
import { Search } from "lucide-react-native";

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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        width: 300,
        backgroundColor: "#fff",
      }}
    >
      <Search size={20} color="#000" />

      <View>
        <TextInput
          placeholder={placeholder}
          // value={""}
          onChangeText={onChange}
          style={{
            flex: 1,
            fontSize: 15,
          }}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}
