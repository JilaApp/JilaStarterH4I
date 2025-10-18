import { useState, useRef } from "react";
import { clsx } from "clsx";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

interface InputProps {
  type?: "email" | "password";
  disabled?: boolean;
  value?: string; // This prop will now be the source of truth
  onChange?: (value: string) => void;
  icon?: "mail" | "lock";
  showPasswordToggle?: boolean;
  placeholder?: string;
  id?: string;
}

export default function Input({
  type = "email",
  disabled = false,
  value = "", // Keep this prop
  onChange,
  icon = "mail",
  showPasswordToggle = true,
  placeholder = "Enter Email",
  id,
}: InputProps) {
  // REMOVED: const [input, setInput] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // The component no longer sets its own state for the value.
    // It only tells the parent component that the value has changed.
    onChange?.(e.target.value);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setShowPassword(!showPassword);
      inputRef.current?.focus();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleLabelMouseDown = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    const target = e.target as HTMLElement;
    if (target.tagName !== "INPUT") {
      e.preventDefault();
    }
    setIsFocused(true);
  };

  const renderIcon = () => {
    const iconColor = isFocused
      ? "var(--color-type-400)"
      : "var(--color-gray-300)";
    return icon === "mail" ? (
      <Mail color={iconColor} />
    ) : (
      <LockKeyhole color={iconColor} />
    );
  };

  const renderPasswordToggle = () => {
    if (!showPasswordToggle || icon !== "lock" || type !== "password")
      return null;
    const iconColor = isFocused
      ? "var(--color-type-400)"
      : "var(--color-gray-300)";
    return showPassword ? (
      <Eye color={iconColor} />
    ) : (
      <EyeOff color={iconColor} />
    );
  };

  const inputType = type === "password" && !showPassword ? "password" : "text";

  const getContainerClasses = () =>
    clsx(
      "flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px]",
      {
        "border-gray-300 bg-gray-200 text-gray-300": disabled,
        "border-jila-400 bg-white text-gray-300": !disabled && isFocused,
        "border-gray-300 bg-white text-gray-300": !disabled && !isFocused,
      },
    );

  const getInputClasses = () =>
    clsx("focus:outline-none link-text w-[346px]", {
      "text-gray-300": disabled || !isFocused,
      "text-type-400": !disabled && isFocused,
    });

  return (
    <label
      htmlFor={id}
      className={getContainerClasses()}
      onMouseDown={handleLabelMouseDown}
    >
      <div className="mr-[8px]">{renderIcon()}</div>
      <input
        ref={inputRef}
        id={id}
        className={getInputClasses()}
        type={inputType}
        value={value} // *** THE FIX IS HERE *** Use the 'value' prop directly
        placeholder={!isFocused && !value ? placeholder : ""} // Also use 'value' prop here
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
      />
      <div onMouseDown={disabled ? undefined : togglePasswordVisibility}>
        {renderPasswordToggle()}
      </div>
    </label>
  );
}
