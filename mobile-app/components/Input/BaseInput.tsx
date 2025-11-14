import { useState, useRef } from "react";
import { View, TextInput } from "react-native";
import type { TextInput as RNTextInput } from "react-native";
import { BaseInputProps } from "./types";

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

  const containerClass = [
    "flex-row items-center border-[1px] rounded-[10px] px-[15px] py-[10px] max-w-[275px]",
    "h-[60px]",
    disabled ? "border-gray-300 bg-gray-200" : "border-gray-200 bg-white",
    !disabled && state === "error" ? "border-error-400 bg-white" : null,
    !disabled && isFocused && state !== "error"
      ? "border-jila-400 bg-white"
      : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClass = [
    "flex-1 h-full rounded-[10px] text-black font-[500]",
    disabled ? "text-gray-400" : null,
    !isFocused && value ? "text-gray-400" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View accessible accessibilityRole="text" className={containerClass}>
      {/* TODO: make selection cursor jila 400*/}
      {icon && <View className="pr-[8px] text-gray-300">{icon}</View>}

      <TextInput
        underlineColorAndroid="transparent"
        ref={inputRef}
        selectionColor="rgba(126, 6, 1)"
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
        className={`${inputClass} focus:outline-none`}
        {...inputProps}
      />

      {rightElement && (
        <View className="flex-row items-center pl-2 pr-2">{rightElement}</View>
      )}
    </View>
  );
}
