import { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import type { TextInput as RNTextInput } from "react-native";
import { BaseInputProps } from "./types";
import { colors } from "@/colors";

export function BaseInput({
  type = "text",
  disabled = false,
  placeholder = "Enter text",
  id,
  state = "default",
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightElement,
  className,
  inputProps,
  autoComplete,
}: BaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput | null>(null);

  const handleChangeText = (text: string) => {
    onChange?.(text);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerStyle = () => {
    if (disabled) {
      return [styles.container, styles.containerDisabled];
    }
    if (state === "error") {
      return [styles.container, styles.containerError];
    }
    if (isFocused && state !== "error") {
      return [styles.container, styles.containerFocused];
    }
    return [styles.container, styles.containerDefault];
  };

  const getInputColor = () => {
    if (disabled) return colors.gray[400];
    if (!isFocused && value) return colors.gray[400];
    return colors.black;
  };

  return (
    <View accessible accessibilityRole="text" style={getContainerStyle()}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <TextInput
        underlineColorAndroid="transparent"
        ref={inputRef}
        selectionColor={colors.jila[400]}
        secureTextEntry={type === "password" ? true : undefined}
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={!disabled}
        placeholderTextColor="#9CA3AF"
        autoComplete={autoComplete as any}
        testID={id}
        style={[styles.input, { color: getInputColor() }]}
        scrollEnabled={false}
        multiline={false}
        autoCapitalize="none"
        {...inputProps}
      />

      {rightElement && (
        <View style={styles.rightElementContainer}>{rightElement}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxWidth: 275,
    height: 60,
  },
  containerDefault: {
    borderColor: colors.gray[200],
    backgroundColor: colors.white[400],
  },
  containerDisabled: {
    borderColor: colors.gray[300],
    backgroundColor: colors.gray[200],
  },
  containerError: {
    borderColor: colors.error[400],
    backgroundColor: colors.white[400],
  },
  containerFocused: {
    borderColor: colors.jila[400],
    backgroundColor: colors.white[400],
  },
  iconContainer: {
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontWeight: "500",
    paddingLeft: 4,
    textAlignVertical: "center",
    paddingVertical: 0,
  },
  rightElementContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 8,
  },
});
