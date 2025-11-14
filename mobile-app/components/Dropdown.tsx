import React, { useState } from "react";
import { View, TouchableOpacity, Text, Pressable } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";



interface DropdownProps {
  text: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  text,
  options,
  selected,
  onSelect,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="relative w-80 rounded-xl">
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View
          className={`flex-row items-center justify-between w-80 border rounded-xl px-4 py-3 bg-white ${
            open ? "border-jila-400" : "border-gray-400"
          }`}
        >
          <Text className={`${selected ? "text-gray-800" : "text-gray-400"}`}>
            {selected || text}
          </Text>
          {open ? (
            <ChevronDown size={20} color="#000000" />
          ) : (
            <ChevronRight size={20} color="#000000" />
          )}
        </View>
      </TouchableOpacity>

      {open && (
        <View
          className="absolute left-0 mt-4 w-80 bg-white z-50 overflow-hidden"
          style={{
            top: "100%",
            position: "absolute",
          }}
        >
          {options.map((option, index) => {
            const isSelected = option === selected;
            const isFirst = index === 0;
            const isLast = index === options.length - 1;

            let roundingClasses = '';
            if (isFirst) {
              roundingClasses += 'rounded-t-xl';
            }
            if (isLast) {
              roundingClasses += ' rounded-b-xl';
            }

            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
              >
                <View
                  className={`px-4 py-3 ${
                    !isFirst ? "border-t border-gray-400" : ""
                  } ${
                    isSelected ? "bg-gray-300" : "bg-white-400"
                  } ${roundingClasses}`}
                >
                  <Text>{option}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
