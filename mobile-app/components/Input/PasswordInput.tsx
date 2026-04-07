import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { BaseInput } from "./BaseInput";
import { CommonInputProps } from "./types";
import { inputVariants } from "./variants";
import { TextInputProps, Pressable } from "react-native";
import { colors } from "@/colors";
import { sizes } from "@/constants/sizes";
import { useTranslation } from 'react-i18next';


export function PasswordInput({
  placeholder = inputVariants.password.placeholder,
  autoComplete = "current-password",
  ...props
}: CommonInputProps & { autoComplete?: TextInputProps["autoComplete"] }) {
  const [showPassword, setShowPassword] = useState(false);
  const { icon: Icon } = inputVariants.password;
  const { t } = useTranslation();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <BaseInput
      type={showPassword ? "text" : "password"}
      placeholder={placeholder ?? t('CreateProfilePage.EnterUser')}
      icon={<Icon size={sizes.icon.md} color={colors.gray[300]} />}
      rightElement={
        <Pressable
          onPress={togglePasswordVisibility}
          disabled={props.disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Eye size={sizes.icon.md} color={colors.gray[300]} />
          ) : (
            <EyeOff size={sizes.icon.md} color={colors.gray[300]} />
          )}
        </Pressable>
      }
      autoComplete={autoComplete}
      {...props}
    />
  );
}
