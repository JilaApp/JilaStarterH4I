import { useState, useRef, ReactNode, FocusEvent, ChangeEvent } from "react";
import { clsx } from "clsx";
import { Mail, LockKeyhole, Eye, EyeOff, Type } from "lucide-react";

interface CommonInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
  value?: string;
  className?: string;
}

interface BaseInputProps extends CommonInputProps {
  type?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

function BaseInput({
  type = "text",
  disabled = false,
  placeholder = "Enter text",
  id,
  state = "normal",
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
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
      className,
    );
  };

  const getInputClasses = () => {
    return clsx("focus:outline-none link-text w-full h-full pl-[18px]", {
      "cursor-not-allowed text-gray-400": disabled,
      "text-gray-400": !isFocused && value,
    });
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
      />
      {rightElement && <div className="flex items-center">{rightElement}</div>}
    </label>
  );
}

const inputVariants = {
  email: {
    type: "email",
    icon: Mail,
    placeholder: "Enter your email",
  },
  password: {
    type: "password",
    icon: LockKeyhole,
    placeholder: "Enter your password",
  },
  text: {
    type: "text",
    icon: Type,
    placeholder: "Enter text",
  },
};

export function TextInput({
  placeholder = inputVariants.text.placeholder,
  ...props
}: CommonInputProps) {
  const { type } = inputVariants.text;
  return <BaseInput type={type} placeholder={placeholder} {...props} />;
}

export function EmailInput({
  placeholder = inputVariants.email.placeholder,
  ...props
}: CommonInputProps) {
  const { type, icon: Icon } = inputVariants.email;
  return (
    <BaseInput
      type={type}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      {...props}
    />
  );
}

export function PasswordInput({
  placeholder = inputVariants.password.placeholder,
  ...props
}: CommonInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { icon: Icon } = inputVariants.password;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <BaseInput
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      rightElement={
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={props.disabled}
          className="text-gray-300 group-focus-within:text-type-400 hover:text-type-400 transition-colors disabled:cursor-not-allowed"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      }
      {...props}
    />
  );
}

export default BaseInput;
