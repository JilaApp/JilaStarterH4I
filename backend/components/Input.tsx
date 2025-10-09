import { useState } from "react";
import { clsx } from "clsx";

import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";

interface InputProps {
  type?: "email" | "password";
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  icon?: "mail" | "lock";
  showPasswordToggle?: boolean;
  placeholder?: string;
  id?: string;
}

export default function Input({
  type = "email",
  disabled = false,
  value = "",
  onChange,
  icon = "mail",
  showPasswordToggle = true,
  placeholder = "Enter Email",
  id,
}: InputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    onChange?.(newInput);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disabled) {
      setShowPassword(!showPassword);
      setIsFocused(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
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
        "border-jila-400 bg-white text-gray-300": !disabled && isFocused,
        "border-gray-300 bg-white text-gray-300": !disabled && !isFocused,
      },
    );
  };

  const getInputClasses = () => {
    return clsx("focus:outline-none link-text w-[346px]", {
      "text-gray-300": disabled || !isFocused,
      "text-type-400": !disabled && isFocused,
    });
  };

  return (
    <label
      htmlFor={id}
      className={getContainerClasses()}
      onMouseDown={handleLabelMouseDown}
    >
      <div className="mr-[8px]">
        {icon === "mail" ? (
          isFocused ? (
            <Mail color="var(--color-type-400)" />
          ) : (
            <Mail color="var(--color-gray-300)" />
          )
        ) : isFocused ? (
          <LockKeyhole color="var(--color-type-400)" />
        ) : (
          <LockKeyhole color="var(--color-gray-300)" />
        )}
      </div>
      <input
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
        {showPasswordToggle &&
          icon === "lock" &&
          type === "password" &&
          (showPassword ? (
            isFocused && showPassword ? (
              <Eye color="var(--color-type-400)" />
            ) : (
              <Eye color="var(--color-gray-300)" />
            )
          ) : isFocused && !showPassword ? (
            <EyeOff color="var(--color-type-400)" />
          ) : (
            <EyeOff color="var(--color-gray-300)" />
          ))}
      </div>
    </label>
  );
}
