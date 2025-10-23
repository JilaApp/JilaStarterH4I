import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

import { Mail, LockKeyhole, Eye, EyeOff, Ban } from "lucide-react";

interface InputProps {
  type?: "text" | "email" | "password";
  disabled?: boolean;
  onChange?: (value: string) => void;
  icon?: "mail" | "lock";
  showPasswordToggle?: boolean;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
}

export default function Input({
  type = "text",
  disabled = false,
  onChange,
  icon,
  showPasswordToggle = true,
  placeholder = "Enter text",
  id,
  state,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(error);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(
    errorMessage || "",
  );
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasError(error);
    setCurrentErrorMessage(errorMessage || "");
  }, [error, errorMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    onChange(newInput);

    if (hasError) {
      clearError();
    }
  };

  const setError = (message: string) => {
    setHasError(true);
    setCurrentErrorMessage(message);
    onErrorChange?.(true, message);
  };

  const clearError = () => {
    setHasError(false);
    setCurrentErrorMessage("");
    onErrorChange?.(false, "");
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled) {
      setShowPassword(!showPassword);
      inputRef.current?.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (required && hasInteracted && !value.trim()) {
      setError("This field is required");
    } else if (
      type === "email" &&
      hasInteracted &&
      value.trim() &&
      !isValidEmail(value)
    ) {
      setError("Please enter a valid email address");
    }
  };

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

    if (icon === "mail") {
      return <Mail color={iconColor} />;
    } else if (icon === "lock") {
      return <LockKeyhole color={iconColor} />;
    }
  };

  const renderPasswordToggle = () => {
    if (!showPasswordToggle || icon !== "lock" || type !== "password") {
      return null;
    }

    const iconColor = isFocused
      ? "var(--color-type-400)"
      : "var(--color-gray-300)";

    if (showPassword) {
      return <Eye color={iconColor} />;
    } else {
      return <EyeOff color={iconColor} />;
    }
  };

  let inputType;
  if (type === "password" && !showPassword) {
    inputType = "password";
  } else {
    inputType = "text";
  }

  const getContainerClasses = () => {
    return clsx(
      "flex items-center border-[1px] rounded-[10px] pl-[18px] w-[450px] h-[60px]",
      {
        "border-gray-300 bg-gray-200 text-gray-300": disabled,
        "border-error-400 bg-white text-gray-300 shadow-[0px_0px_0px_3px_rgba(255,168,168,1)]":
          !disabled && hasError,
        "border-jila-400 bg-white text-gray-300":
          !disabled && isFocused && !hasError,
        "border-gray-300 bg-white text-gray-300":
          !disabled && !isFocused && !hasError,
      },
    );
  };

  const getInputClasses = () => {
    return clsx("focus:outline-none link-text", {
      "w-[346px]": icon,
      "w-[414px]": !icon,
      "text-gray-300": disabled || (!isFocused && !hasError),
      "text-type-400": !disabled && isFocused && !hasError,
      "text-red-500": !disabled && hasError,
    });
  };

  return (
    <label
      htmlFor={id}
      className={getContainerClasses()}
      onMouseDown={handleLabelMouseDown}
      style={
        state === "error"
          ? {
              borderColor: "var(--color-error-400)",
              boxShadow: "0 0 0 3px #FFA8A8",
            }
          : undefined
      }
    >
      <div className="mr-[8px]">{renderIcon()}</div>
      <input
        ref={inputRef}
        id={id}
        className={getInputClasses()}
        type={inputType}
        value={input}
        placeholder={!isFocused && !input ? placeholder : ""}
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
