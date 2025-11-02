import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";

export function PasswordInput({
  placeholder = inputVariants.password.placeholder,
  autoComplete = "current-password",
  ...props
}: CommonInputProps & { autoComplete?: string }) {
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
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      }
      autoComplete={autoComplete}
      {...props}
    />
  );
}
