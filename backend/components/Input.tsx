import { useRef } from "react";
import { clsx } from "clsx";
import { Mail, LockKeyhole, Eye, EyeOff, Type } from "lucide-react";

interface BaseInputProps {
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
  value?: string;
  isFocused?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  className?: string;
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
  isFocused = false,
  icon,
  rightElement,
  className = "",
}: BaseInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const getContainerClasses = () => {
    return clsx(
      "flex items-center border-[1px] rounded-[10px] w-[450px] h-[60px] pr-[18px]",
      {
        "border-gray-300 bg-gray-200": disabled,
        "border-error-400 bg-white": !disabled && state === "error",
        "border-jila-400 bg-white shadow-[0px_0px_0px_3px_rgba(255,225,225,1)]":
          !disabled && isFocused && state !== "error",
        "border-gray-300 bg-white":
          !disabled && !isFocused && state !== "error",
      },
      className,
    );
  };

  const getInputClasses = () => {
    return clsx("focus:outline-none link-text w-full h-full pl-[18px]", {
      "cursor-not-allowed": disabled,
      "text-gray-400": disabled,
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
        style={{
          color:
            !disabled && state === "error"
              ? "rgba(205, 205, 205, 1)"
              : !disabled && !isFocused
                ? "rgba(161, 161, 161, 1)"
                : undefined,
        }}
      />
      {rightElement && <div className="flex items-center">{rightElement}</div>}
    </label>
  );
}

// Input Variant Mapping
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

// Text Input
interface TextInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
  value?: string;
  isFocused?: boolean;
  className?: string;
}

export function TextInput({
  placeholder = inputVariants.text.placeholder,
  ...props
}: TextInputProps) {
  const { type } = inputVariants.text;

  return <BaseInput type={type} placeholder={placeholder} {...props} />;
}

// Email Input
interface EmailInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
  value?: string;
  isFocused?: boolean;
  className?: string;
}

export function EmailInput({
  placeholder = inputVariants.email.placeholder,
  ...props
}: EmailInputProps) {
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

// Password Input
interface PasswordInputProps {
  disabled?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  state?: "normal" | "error";
  value?: string;
  isFocused?: boolean;
  className?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function PasswordInput({
  placeholder = inputVariants.password.placeholder,
  showPassword = false,
  onTogglePassword,
  ...props
}: PasswordInputProps) {
  const { icon: Icon } = inputVariants.password;

  return (
    <BaseInput
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      rightElement={
        onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={props.disabled}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )
      }
      {...props}
    />
  );
}

export default BaseInput;
