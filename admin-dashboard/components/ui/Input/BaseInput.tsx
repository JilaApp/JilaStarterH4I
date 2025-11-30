import { useState, useRef } from "react";
import { clsx } from "clsx";
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
  className = "",
  autoComplete,
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
      "group flex items-center border rounded-[10px] pr-[18px]",
      {
        "h-[60px]": className.length === 0, // Only apply default height if no className is provided
        "w-full": className.length === 0, // Only apply default width if no className is provided
        "border-gray-300 bg-gray-200": disabled,
        "border-error-400 bg-white": !disabled && state === "error",
        "border-jila-400 bg-white": !disabled && isFocused && state !== "error",
        "border-gray-300 bg-white":
          !disabled && !isFocused && state !== "error",
      },
      className,
    );
  };

  const getInputClasses = () => {
    return clsx(
      "focus:outline-none text-lg font-semibold w-full h-full pl-[18px] rounded-[10px] placeholder:font-semibold",
      {
        "cursor-not-allowed text-gray-300": disabled,
        "text-type-400": !disabled && value,
        "text-gray-300 placeholder:text-gray-300": !disabled && !value,
      },
    );
  };

  return (
    <label
      htmlFor={id}
      className={getContainerClasses()}
      style={
        state === "error"
          ? {
              boxShadow: "0 0 0 3px #FFA8A8",
            }
          : undefined
      }
    >
      {icon && (
        <div
          className={clsx("pl-[18px] pr-[12px] flex items-center", {
            "text-type-400": isFocused,
            "text-gray-300": !isFocused,
          })}
        >
          {icon}
        </div>
      )}
      <input
        ref={inputRef}
        id={id}
        name={name || id}
        className={getInputClasses()}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        aria-invalid={state === "error"}
        autoComplete={autoComplete}
      />
      {rightElement && <div className="flex items-center">{rightElement}</div>}
    </label>
  );
}
