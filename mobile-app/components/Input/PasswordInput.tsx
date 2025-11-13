import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";
import { TextInputProps, Pressable } from "react-native";

export function PasswordInput({
  placeholder = inputVariants.password.placeholder,
  autoComplete = "current-password",
  ...props
}: CommonInputProps & { autoComplete?: TextInputProps["autoComplete"] }) {
  const [showPassword, setShowPassword] = useState(false);
  const { icon: Icon } = inputVariants.password;

  console.log(showPassword);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <BaseInput
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      icon={<Icon size={20} />}
      rightElement={
        <Pressable
          onPress={togglePasswordVisibility}
          disabled={props.disabled}
          className="text-gray-300 group-focus-within:text-type-400 hover:text-type-400 transition-colors disabled:cursor-not-allowed"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </Pressable>
      }
      autoComplete={autoComplete}
      {...props}
    />
  );
}
