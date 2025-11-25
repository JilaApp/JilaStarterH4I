import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
      style={[
        styles.container,
        isFocused ? styles.containerFocused : styles.containerUnfocused,
      ]}
    >
      <Search size={sizes.icon.md} color={colors.gray[300]} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.gray[300]}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        style={styles.input}
        selectionColor={colors.jila[400]}
        scrollEnabled={false}
        multiline={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange("")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={sizes.icon.md} color={colors.black} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white[400],
    paddingHorizontal: sizes.spacing.lg,
    minHeight: sizes.touch.minTarget,
    width: "100%",
    borderRadius: sizes.borderRadius.lg,
    borderWidth: 1,
  },
  containerFocused: {
    borderColor: colors.jila[400],
  },
  containerUnfocused: {
    borderColor: colors.gray[200],
  },
  input: {
    marginLeft: sizes.spacing.sm,
    flex: 1,
    backgroundColor: colors.white[400],
    color: colors.black,
    fontWeight: "700",
    fontSize: sizes.fontSize.base,
    paddingVertical: 0,
  },
});
