import { useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import type { TextInput as RNTextInput } from "react-native";
import { BaseInputProps } from "./types";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";

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
    if (disabled) return colors.gray[300];
    if (!isFocused && value) return colors.gray[300];
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
        placeholderTextColor={colors.gray[300]}
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
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.sm,
    width: "100%",
    minHeight: sizes.touch.minTarget + sizes.spacing.md,
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
    paddingRight: sizes.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    paddingLeft: sizes.spacing.xs,
    textAlignVertical: "center",
    paddingVertical: 0,
  },
  rightElementContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: sizes.spacing.sm,
    paddingRight: sizes.spacing.sm,
  },
});
