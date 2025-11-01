import { useState, useRef } from "react";
import { clsx } from "clsx";
import { BaseInputProps } from "./types";

export function BaseInput({
  type = "text",
  disabled = false,
  placeholder = "Enter text",
  id,
  state = "default",
  value,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightElement,
  className = "",
}: BaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerClasses = () => {
    return clsx(
      "group flex items-center border-[1px] rounded-[10px] w-[450px] h-[60px] pr-[18px]",
      {
        "border-gray-300 bg-gray-200": disabled,
        "border-error-400 bg-white": !disabled && state === "error",
        "border-jila-400 bg-white": !disabled && isFocused && state !== "error",
        "border-gray-300 bg-white":
          !disabled && !isFocused && state !== "error",
      },
      className
    );
  };

  const getInputClasses = () => {
    return clsx(
      "focus:outline-none link-text w-full h-full pl-[18px] rounded-[10px]",
      {
        "cursor-not-allowed text-gray-400": disabled,
        "text-gray-400": !isFocused && value,
      }
    );
  };

  const iconColor = isFocused
    ? "var(--color-type-400)"
    : "var(--color-gray-300)";

  return (
    <label
      htmlFor={id}
      className={getContainerClasses()}
      style={
        state === "error"
          ? {
              borderColor: "var(--color-error-400)",
              boxShadow: "0 0 0 3px #FFA8A8",
            }
          : undefined
      }
    >
      {icon && (
        <div
          className="pl-[18px] pr-[12px] flex items-center"
          style={{ color: iconColor }}
        >
          {icon}
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        className={getInputClasses()}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-invalid={state === "error"}
      />
      {rightElement && <div className="flex items-center">{rightElement}</div>}
    </label>
  );
}
